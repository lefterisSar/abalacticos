package com.example.abalacticos.controller;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Dtos.AbalacticosUserDTO;
import com.example.abalacticos.service.UserService;
import org.modelmapper.ModelMapper;

import com.example.abalacticos.model.FormationDTOS.FormationRequest;
import com.example.abalacticos.model.Formation;
import com.example.abalacticos.service.FormationService;
import com.example.abalacticos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/formations")
public class FormationController {
    @Autowired
    private FormationService formationService;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping("/create")
    public Formation createFormation(@Valid @RequestBody FormationRequest formationRequest) {
        LocalDateTime dateTime = formationRequest.getDateTime();
        int numberOfPlayers = formationRequest.getNumberOfPlayers();
        int autoFillPlayersCount = formationRequest.getAutoFillPlayersCount();
        int manualFillPlayersCount = formationRequest.getManualFillPlayersCount();
        List<String> manualPlayerIds = formationRequest.getManualPlayerIds();
        List<String> unregisteredPlayerNames = formationRequest.getUnregisteredPlayerNames();

        return formationService.createFormation(dateTime, numberOfPlayers, autoFillPlayersCount, manualFillPlayersCount, manualPlayerIds, unregisteredPlayerNames);
    }


    @GetMapping("/all")
    public List<Formation> getAllFormations() {
        return formationService.getAllFormations();
    }

    @GetMapping("/{id}")
    public Optional<Formation> getFormationById(@PathVariable String id) {
        return formationService.getFormationById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public Formation updateFormation(@PathVariable String id, @RequestBody FormationRequest formationRequest) {
        return formationService.updateFormation(id, formationRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteFormation(@PathVariable String id) {
        formationService.deleteFormation(id);
    }

    // **Endpoint for Automatic Team Splitting**
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/auto-split-teams")
    public ResponseEntity<?> autoSplitTeams(@PathVariable String id) {
        formationService.autoSplitTeams(id);
        return ResponseEntity.ok("Teams automatically split and colors assigned.");
    }

    // **Endpoint for Manual Team Assignment**
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/manual-assign-teams")
    public ResponseEntity<?> manualAssignTeams(@PathVariable String id, @RequestBody Map<String, List<String>> teamAssignments) {
        formationService.manualAssignTeams(id, teamAssignments);
        return ResponseEntity.ok("Teams manually assigned and colors allocated.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/available-players")
    public List<AbalacticosUserDTO> getAvailablePlayers(@RequestParam("dateTime") String dateTimeStr) {
        LocalDateTime dateTime = LocalDateTime.parse(dateTimeStr);
        List<AbalacticosUser> availablePlayers = userService.getAvailablePlayersForDate(dateTime);

        return availablePlayers.stream()
                .map(user -> modelMapper.map(user, AbalacticosUserDTO.class))
                .collect(Collectors.toList());
    }


    //Endpoint to fetch available and absent players for a specific date.
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/available-players-by-date")
    public ResponseEntity<Map<String, List<AbalacticosUser>>> getAvailablePlayersByDate(@RequestParam("dateTime") String dateTimeStr) {
        LocalDateTime dateTime = LocalDateTime.parse(dateTimeStr);
        List<AbalacticosUser> players = userService.getPlayersByDate(dateTime);

        // Separate players into available and absent
        List<AbalacticosUser> availablePlayers = players.stream()
                .filter(player -> !player.isAbsent())
                .collect(Collectors.toList());

        List<AbalacticosUser> absentPlayers = players.stream()
                .filter(AbalacticosUser::isAbsent)
                .collect(Collectors.toList());

        // Create a map to return both lists
        Map<String, List<AbalacticosUser>> response = Map.of(
                "availablePlayers", availablePlayers,
                "absentPlayers", absentPlayers
        );

        return ResponseEntity.ok(response);
    }

}
