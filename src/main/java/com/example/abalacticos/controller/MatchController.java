package com.example.abalacticos.controller;

import com.example.abalacticos.model.Match;
import com.example.abalacticos.service.MatchService;
import com.example.abalacticos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

        return ResponseEntity.ok("Match recorded and player appearances updated");
    }

    @GetMapping
    public List<Match> getAllMatches() {
        return matchService.getAllMatches();
    }
}
