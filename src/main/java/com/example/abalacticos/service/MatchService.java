package com.example.abalacticos.service;

import com.example.abalacticos.model.Match;
import com.example.abalacticos.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserService userService;

    @Autowired
    public MatchService(MatchRepository matchRepository, UserService userService) {
        this.matchRepository = matchRepository;
        this.userService = userService;
    }

    public Match saveMatch(Match match) {
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
        switch (result) {
            case "TeamA" -> {
                userService.incrementWins(match.getTeamA());
                userService.incrementLosses(match.getTeamB());
            }
            case "TeamB" -> {
                userService.incrementWins(match.getTeamB());
                userService.incrementLosses(match.getTeamA());
            }
            case "Draw" -> {
                userService.incrementDraws(match.getTeamA());
                userService.incrementDraws(match.getTeamB());
            }
        }
        match.setResult(result);
        matchRepository.save(match);
    }


}
