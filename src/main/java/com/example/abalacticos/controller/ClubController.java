package com.example.abalacticos.controller;

import com.example.abalacticos.model.Club;
import com.example.abalacticos.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

    // Endpoint to add a new club (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<Club> addClub(@RequestBody Club club) {
        Club newClub = clubService.addClub(club);
        return ResponseEntity.ok(newClub);
    }

    // Endpoint to get all clubs
    @GetMapping
    public ResponseEntity<List<Club>> getAllClubs() {
        List<Club> clubs = clubService.getAllClubs();
        return ResponseEntity.ok(clubs);
    }

    // Endpoint to delete a club by ID (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClub(@PathVariable String id) {
        clubService.deleteClubById(id);
        return ResponseEntity.ok("Club deleted successfully");
    }
}
