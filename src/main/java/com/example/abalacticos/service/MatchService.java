package com.example.abalacticos.service;

import com.example.abalacticos.model.Match;
import com.example.abalacticos.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserService userService;

    @Autowired
    public MatchService(MatchRepository matchRepository, UserService userService) {
        this.matchRepository = matchRepository;
        this.userService = userService;
    }

    public Match saveMatch(Match match, List<String> teamAIds, List<String> teamBIds) {
        // Initialize teamA and teamB with "TBD" status
        List<Map<String, String>> teamA = teamAIds.stream()
                .map(playerId -> Map.of(playerId, "TBD"))
                .collect(Collectors.toList());

        List<Map<String, String>> teamB = teamBIds.stream()
                .map(playerId -> Map.of(playerId, "TBD"))
                .collect(Collectors.toList());

        match.setTeamA(teamA);
        match.setTeamB(teamB);

        return matchRepository.save(match);
    }

    public void deleteMatch(String id) {
        matchRepository.deleteById(id);
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public Match getMatchById(String id) {
        return matchRepository.findById(id).orElseThrow(() -> new RuntimeException("Match not found"));
    }

    public void updateMatchResult(Match match, String result) {
        // Existing logic here...
    }

    public void updatePlayerStatus(String matchId, String playerId, String status) {
        Match match = getMatchById(matchId);

        // Update the player's status in teamA or teamB
        match.getTeamA().forEach(playerStatusMap -> {
            if (playerStatusMap.containsKey(playerId)) {
                playerStatusMap.put(playerId, status);
            }
        });

        match.getTeamB().forEach(playerStatusMap -> {
            if (playerStatusMap.containsKey(playerId)) {
                playerStatusMap.put(playerId, status);
            }
        });

        matchRepository.save(match);
    }
}
