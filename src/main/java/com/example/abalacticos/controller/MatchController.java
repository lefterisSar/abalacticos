package com.example.abalacticos.controller;

import com.example.abalacticos.model.Match;
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

    @Autowired
    public MatchController(MatchService matchService, UserService userService) {
        this.matchService = matchService;
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> saveMatch(@RequestBody Match match) {
        Match savedMatch = matchService.saveMatch(match);
        userService.incrementDayAppearances(match.getTeamA(), match.getDay());
        userService.incrementDayAppearances(match.getTeamB(), match.getDay());

        // Increment overallApps for all players in the match
        userService.incrementOverallApps(match.getTeamA());
        userService.incrementOverallApps(match.getTeamB());

        // Update the lastGK date for the player in the GK position
        if (!match.getTeamA().isEmpty()) {
            userService.updateLastGK(Collections.singletonList(match.getTeamA().get(0)), match.getDatePlayed());
        }
        if (!match.getTeamB().isEmpty()) {
            userService.updateLastGK(Collections.singletonList(match.getTeamB().get(0)), match.getDatePlayed());
        }

        return ResponseEntity.ok("Match recorded and player appearances updated");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMatch(@PathVariable String id) {
        try {
            Match match = matchService.getMatchById(id);
            matchService.deleteMatch(id);
            userService.decrementDayAppearances(match.getTeamA(), match.getDay());
            userService.decrementDayAppearances(match.getTeamB(), match.getDay());

            // Decrement overallApps for all players in the match
            userService.decrementOverallApps(match.getTeamA());
            userService.decrementOverallApps(match.getTeamB());

                return ResponseEntity.ok("Match deleted and player appearances updated");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping
    public List<Match> getAllMatches() {
        return matchService.getAllMatches();
    }
}
