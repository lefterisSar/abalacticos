package com.example.abalacticos.service;

import com.example.abalacticos.model.Match;
import com.example.abalacticos.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public Match updateMatch(Match existingMatch, List<String> teamAIds, List<String> teamBIds) {
        // Create a map to easily look up existing statuses by player ID
        Map<String, String> existingTeamAStatus = existingMatch.getTeamA().stream()
                .collect(Collectors.toMap(map -> map.keySet().iterator().next(), map -> map.values().iterator().next()));

        Map<String, String> existingTeamBStatus = existingMatch.getTeamB().stream()
                .collect(Collectors.toMap(map -> map.keySet().iterator().next(), map -> map.values().iterator().next()));

        // Update teamA and teamB with new player IDs, maintaining existing statuses where available
        List<Map<String, String>> updatedTeamA = teamAIds.stream()
                .map(playerId -> {
                    String status = existingTeamAStatus.getOrDefault(playerId, "TBD");
                    return Map.of(playerId, status);
                })
                .collect(Collectors.toList());

        List<Map<String, String>> updatedTeamB = teamBIds.stream()
                .map(playerId -> {
                    String status = existingTeamBStatus.getOrDefault(playerId, "TBD");
                    return Map.of(playerId, status);
                })
                .collect(Collectors.toList());

        // Set the updated teams in the existing match
        existingMatch.setTeamA(updatedTeamA);
        existingMatch.setTeamB(updatedTeamB);

        // Save and return the updated match
        return matchRepository.save(existingMatch);
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

    public Match getMatchByDayDateAndId(String day, String datePlayed, String matchId) {
        return matchRepository.findByDayAndDatePlayedAndId(day, LocalDate.parse(datePlayed), matchId)
                .orElse(null);
    }

}
