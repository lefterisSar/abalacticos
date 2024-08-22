package com.example.abalacticos.controller;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Match;
import com.example.abalacticos.service.DiscordBotService;
import com.example.abalacticos.service.MatchService;
import com.example.abalacticos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;
    private final UserService userService;
    private final DiscordBotService discordBotService;

    @Autowired
    public MatchController(MatchService matchService, UserService userService, DiscordBotService discordBotService) {
        this.matchService = matchService;
        this.userService = userService;
        this.discordBotService = discordBotService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmTeamsAndNotifyPlayers(@RequestBody Match match) {
        // Save the match
        Match savedMatch = matchService.saveMatch(match);

        // Increment day-specific appearances for Team A and Team B
        userService.incrementDayAppearances(savedMatch.getTeamA(), savedMatch.getDay());
        userService.incrementDayAppearances(savedMatch.getTeamB(), savedMatch.getDay());

        // Increment overallApps for all players in the match
        userService.incrementOverallApps(savedMatch.getTeamA());
        userService.incrementOverallApps(savedMatch.getTeamB());

        // Update the lastGK date for the player in the GK position
        if (!savedMatch.getTeamA().isEmpty()) {
            userService.updateLastGK(Collections.singletonList(savedMatch.getTeamA().get(0)), savedMatch.getDatePlayed());
        }
        if (!savedMatch.getTeamB().isEmpty()) {
            userService.updateLastGK(Collections.singletonList(savedMatch.getTeamB().get(0)), savedMatch.getDatePlayed());
        }

        // Notify players in Team A
        for (String playerID : savedMatch.getTeamA()) {
            AbalacticosUser player = userService.findPlayerById(playerID);
            discordBotService.sendAvailabilityButtons(player, savedMatch.getDatePlayed().toString());
        }

        // Notify players in Team B
        for (String playerID : savedMatch.getTeamB()) {
            AbalacticosUser player = userService.findPlayerById(playerID);
            discordBotService.sendAvailabilityButtons(player, savedMatch.getDatePlayed().toString());
        }

        return ResponseEntity.ok("Teams confirmed, players notified, and match saved successfully.");
    }

    //TODO This should instead delete the win/loss/draw from the players'
    // stats and the Overall Apps should be counted based on those 3.
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMatch(@PathVariable String id) {
        try {
            Match match = matchService.getMatchById(id);

            userService.decrementDayAppearances(match.getTeamA(), match.getDay());
            userService.decrementDayAppearances(match.getTeamB(), match.getDay());

            // Decrement overallApps for all players in the match
            userService.decrementOverallApps(match.getTeamA());
            userService.decrementOverallApps(match.getTeamB());
            matchService.deleteMatch(id);
            return ResponseEntity.ok("Match deleted and player appearances updated");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/win")
    public ResponseEntity<?> updateMatchResult(@PathVariable String id, @RequestParam String winner) {
        Match match = matchService.getMatchById(id);

        if (winner.equals("TeamA")) {
            matchService.updateMatchResult(match, "TeamA");
        } else if (winner.equals("TeamB")) {
            matchService.updateMatchResult(match, "TeamB");
        } else if (winner.isEmpty()) { // Handle draw
            matchService.updateMatchResult(match, "Draw");
        }

        return ResponseEntity.ok("Match result updated and player statistics updated");
    }




    @GetMapping
    public List<Match> getAllMatches() {
        return matchService.getAllMatches();
    }
}
