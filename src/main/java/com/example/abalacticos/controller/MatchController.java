package com.example.abalacticos.controller;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Match;
import com.example.abalacticos.service.DiscordBotService;
import com.example.abalacticos.service.MatchService;
import com.example.abalacticos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

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
    public void confirmTeams(@RequestBody Match match) {
        matchService.saveMatch(match);
    }

    public void saveNewMatch(Match match) {
        // Save the match with initial "TBD" status for all players
        Match savedMatch = matchService.saveMatch(match, extractPlayerIds(match.getTeamA()), extractPlayerIds(match.getTeamB()));

        // Increment day-specific appearances for Team A and Team B
        userService.incrementDayAppearances(extractPlayerIds(savedMatch.getTeamA()), savedMatch.getDay());
        userService.incrementDayAppearances(extractPlayerIds(savedMatch.getTeamB()), savedMatch.getDay());

        // Increment overallApps for all players in the match
        userService.incrementOverallApps(extractPlayerIds(savedMatch.getTeamA()));
        userService.incrementOverallApps(extractPlayerIds(savedMatch.getTeamB()));

        // Update the lastGK date for the player in the GK position
        if (!savedMatch.getTeamA().isEmpty()) {
            userService.updateLastGK(Collections.singletonList(getFirstPlayerId(savedMatch.getTeamA())), savedMatch.getDatePlayed());
        }
        if (!savedMatch.getTeamB().isEmpty()) {
            userService.updateLastGK(Collections.singletonList(getFirstPlayerId(savedMatch.getTeamB())), savedMatch.getDatePlayed());
        }

        // Notify players in Team A
        for (Map<String, String> playerStatus : savedMatch.getTeamA()) {
            String playerId = playerStatus.keySet().iterator().next();
            AbalacticosUser player = userService.findPlayerById(playerId);
            discordBotService.sendAvailabilityButtons(player, savedMatch.getDatePlayed().toString(), match.getId());
        }

        // Notify players in Team B
        for (Map<String, String> playerStatus : savedMatch.getTeamB()) {
            String playerId = playerStatus.keySet().iterator().next();
            AbalacticosUser player = userService.findPlayerById(playerId);
            discordBotService.sendAvailabilityButtons(player, savedMatch.getDatePlayed().toString(), match.getId());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/save")
    public ResponseEntity<?> saveTeamsAndNotifyPlayers(@RequestBody Match match) {
        Match existingMatch = matchService.getMatchByDayDateAndId(match.getDay(), match.getDatePlayed().toString(),match.getId());

        if (existingMatch != null) {
            // If the match exists, update it with the new teams
            matchService.updateMatch(existingMatch, extractPlayerIds(match.getTeamA()), extractPlayerIds(match.getTeamB()));
            return ResponseEntity.ok("Teams updated and players notified for the existing match.");
        } else {
            // If the match does not exist, create a new one
            this.saveNewMatch(match);
            return ResponseEntity.ok("Teams saved, players notified, and new match saved successfully.");
        }
    }

    //TODO This should instead delete the win/loss/draw from the players'
    // stats and the Overall Apps should be counted based on those 3.
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMatch(@PathVariable String id) {
        try {
            Match match = matchService.getMatchById(id);

            userService.decrementDayAppearances(extractPlayerIds(match.getTeamA()), match.getDay());
            userService.decrementDayAppearances(extractPlayerIds(match.getTeamB()), match.getDay());

            // Decrement overallApps for all players in the match
            userService.decrementOverallApps(extractPlayerIds(match.getTeamA()));
            userService.decrementOverallApps(extractPlayerIds(match.getTeamB()));
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


    @GetMapping("/byDayDateAndId")
    public ResponseEntity<?> getMatchByDayDateAndId(@RequestParam String day, @RequestParam String datePlayed, @RequestParam String matchId) {
        Match match = matchService.getMatchByDayDateAndId(day, datePlayed, matchId);
        if (match == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .body(Map.of("error", "Match not found", "type", "NO_MATCH_FOUND"));
        }
        return ResponseEntity.ok(match);
    }

    @GetMapping
    public List<Match> getAllMatches() {
        return matchService.getAllMatches();
    }

    // Helper method to extract player IDs from team lists
    private List<String> extractPlayerIds(List<Map<String, String>> team) {
        return team.stream()
                .map(playerStatus -> playerStatus.keySet().iterator().next())
                .toList();
    }

    // Helper method to get the first player's ID from the team list
    private String getFirstPlayerId(List<Map<String, String>> team) {
        return team.get(0).keySet().iterator().next();
    }



    @PostMapping("/create")
    public ResponseEntity<?> createMatch(@RequestBody Match match) {
        // Save the match
        matchService.saveMatch(match);

        // Add participation records for each player in the match
        LocalDateTime invitationTime = LocalDateTime.now();
        for (Map<String, String> playerStatus : match.getTeamA()) {
            String playerId = playerStatus.keySet().iterator().next();
            userService.addMatchParticipation(playerId, match.getId(), invitationTime);
        }
        for (Map<String, String> playerStatus : match.getTeamB()) {
            String playerId = playerStatus.keySet().iterator().next();
            userService.addMatchParticipation(playerId, match.getId(), invitationTime);
        }

        return ResponseEntity.ok("Match created and participation records updated.");
    }

    @PutMapping("/{matchId}/respond")
    public ResponseEntity<?> respondToMatchInvitation(@PathVariable String matchId, @RequestParam String userId, @RequestParam String status) {
        LocalDateTime responseTime = LocalDateTime.now();
        userService.updateMatchParticipationStatus(userId, matchId, status, responseTime);

        // Optionally update the match object as well
        matchService.updatePlayerStatus(matchId, userId, status);

        return ResponseEntity.ok("Participation status updated.");
    }


}
