package com.example.abalacticos.service;

import com.example.abalacticos.model.Club;
import com.example.abalacticos.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    // Add a new club
    public Club addClub(Club club) {
        return clubRepository.save(club);
    }

    // Get all clubs
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    // Get a club by ID
    public Optional<Club> getClubById(String id) {
        return clubRepository.findById(id);
    }

    // Delete a club by ID
    public void deleteClubById(String id) {
        clubRepository.deleteById(id);
    }
}

