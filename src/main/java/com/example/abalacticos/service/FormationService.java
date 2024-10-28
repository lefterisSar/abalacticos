package com.example.abalacticos.service;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Formation;
import com.example.abalacticos.model.FormationDTOS.FormationRequest;
import com.example.abalacticos.model.PlayerAssignment;
import com.example.abalacticos.repository.FormationRepository;
import com.example.abalacticos.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FormationService {

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public Formation createFormation(
            LocalDateTime dateTime,
            int numberOfPlayers,
            int autoFillPlayersCount,
            int manualFillPlayersCount,
            List<String> manualPlayerIds,
            List<String> autoFillPlayerIds,
            List<String> unregisteredPlayerNames
    ) {
        Formation formation = new Formation(dateTime, numberOfPlayers, autoFillPlayersCount, manualFillPlayersCount);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        formation.setCreatedBy(username);
        formation.setCreatedAt(LocalDateTime.now());


        // Validate manual player IDs
        // Validate manual player IDs
        final List<String> validManualPlayerIds;
        if (manualPlayerIds != null && !manualPlayerIds.isEmpty()) {
            validManualPlayerIds = manualPlayerIds.stream()
                    .filter(id -> {
                        AbalacticosUser user = userRepository.findById(id).orElse(null);
                        if (user == null) return false;

                        // Allow admin to add any player, even if they are banned, injured, absent, or unavailable
                        return true;
                    })
                    .collect(Collectors.toList());
        } else {
            validManualPlayerIds = new ArrayList<>();
        }

        // Validate autofilled player IDs
        final List<String> validAutoFillPlayerIds;
        if (autoFillPlayerIds != null && !autoFillPlayerIds.isEmpty()) {
            validAutoFillPlayerIds = autoFillPlayerIds.stream()
                    .filter(id -> {
                        AbalacticosUser user = userRepository.findById(id).orElse(null);
                        if (user == null) return false;
                        if (user.isBanned()) return false;
                        boolean isEligible = (!user.isInjured() && !user.isAbsent()) || user.isAvailable();
                        boolean isAvailableOnDay = user.getAvailability() != null &&
                                user.getAvailability().stream()
                                        .anyMatch(day -> day.equalsIgnoreCase(dateTime.getDayOfWeek().toString()));
                        return isEligible && isAvailableOnDay;
                    })
                    .collect(Collectors.toList());
        } else {
            validAutoFillPlayerIds = new ArrayList<>();
        }

        // Combine Manual and Auto-Filled Player IDs using Set to prevent duplicates
        Set<String> allPlayerIds = new LinkedHashSet<>();
        allPlayerIds.addAll(validManualPlayerIds);
        allPlayerIds.addAll(validAutoFillPlayerIds);

        // Calculate Remaining Slots for Unregistered Players
        int remainingSlots = numberOfPlayers - allPlayerIds.size();

        // Initialize the List for Unregistered Player Names in the Formation
        List<String> unregisteredPlayerNamesInFormation = new ArrayList<>();



        if (remainingSlots > 0) {
            // Handle Unregistered Player Names Provided by the Admin
            if (unregisteredPlayerNames != null && !unregisteredPlayerNames.isEmpty()) {
                int namesToAdd = Math.min(remainingSlots, unregisteredPlayerNames.size());
                unregisteredPlayerNamesInFormation.addAll(unregisteredPlayerNames.subList(0, namesToAdd));
                remainingSlots -= namesToAdd;
            }


        /*
            //Fill Any Remaining Slots with Placeholders
            for (int i = 0; i < remainingSlots; i++) {
                unregisteredPlayerNamesInFormation.add("Player " + (allPlayerIds.size() + unregisteredPlayerNamesInFormation.size() + 1));
            }

         */
        }

        // Set Player IDs and Unregistered Player Names in the Formation
        formation.setPlayerIds(new ArrayList<>(allPlayerIds));
        formation.setUnregisteredPlayerNames(unregisteredPlayerNamesInFormation);

        // Set Auto-Fill Players Count Based on Valid Auto-Fill Player IDs
        formation.setAutoFillPlayersCount(validAutoFillPlayerIds.size());

        // Save and return the formation
        return formationRepository.save(formation);
    }






    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    public Optional<Formation> getFormationById(String id) {
        return formationRepository.findById(id);
    }

    public Formation updateFormation(String id, Formation updatedFormation) {
        Optional<Formation> optionalFormation = formationRepository.findById(id);
        if (!optionalFormation.isPresent()) {
            throw new RuntimeException("Formation not found with id " + id);
        }

        Formation formation = optionalFormation.get();

        // Update fields
        formation.setDateTime(updatedFormation.getDateTime());
        formation.setNumberOfPlayers(updatedFormation.getNumberOfPlayers());
        formation.setPlayerIds(updatedFormation.getPlayerIds());
        formation.setUnregisteredPlayerNames(updatedFormation.getUnregisteredPlayerNames());
        formation.setTeams(updatedFormation.getTeams());


        return formationRepository.save(formation);
    }


    public void deleteFormation(String id) {
        if (!formationRepository.existsById(id)) {
            throw new RuntimeException("Formation not found with id" + id);
        }
        formationRepository.deleteById(id);
    }

    // **Method to Automatically Split Teams**
    public void autoSplitTeams(String formationId) {
        Optional<Formation> formationOpt = getFormationById(formationId);
        if (formationOpt.isPresent()) {
            Formation formation = formationOpt.get();
            List<String> confirmedPlayers = formation.getPlayerIds();

            // Shuffle the list for randomness
            Collections.shuffle(confirmedPlayers);

            // Split the list into two teams
            int midIndex = confirmedPlayers.size() / 2;
            List<String> team1PlayerIds = confirmedPlayers.subList(0, midIndex);
            List<String> team2PlayerIds = confirmedPlayers.subList(midIndex, confirmedPlayers.size());

            // Assign positions based on your logic
            List<PlayerAssignment> team1Assignments = assignPositionsToPlayers(team1PlayerIds);
            List<PlayerAssignment> team2Assignments = assignPositionsToPlayers(team2PlayerIds);

            // Assign colors
            List<String> colorsAssigned = new ArrayList<>();
            String color1 = formation.getAvailableColors().get(0);
            String color2 = formation.getAvailableColors().get(1);
            colorsAssigned.add(color1);
            colorsAssigned.add(color2);

            // Create team assignments
            Map<String, List<PlayerAssignment>> teamAssignments = new HashMap<>();
            teamAssignments.put(color1, team1Assignments);
            teamAssignments.put(color2, team2Assignments);

            formation.assignTeams(teamAssignments, colorsAssigned);
            formationRepository.save(formation);
        }
    }

    private List<PlayerAssignment> assignPositionsToPlayers(List<String> playerIds) {
        List<PlayerAssignment> assignments = new ArrayList<>();

        // Define positions based on the number of players
        List<String> positions = getPositionsForPlayers(playerIds.size());

        for (int i = 0; i < playerIds.size(); i++) {
            String playerId = playerIds.get(i);
            String position = positions.get(i);

            // Create a new PlayerAssignment with position
            PlayerAssignment assignment = new PlayerAssignment("registered", playerId, position);
            assignments.add(assignment);
        }

        return assignments;
    }

    private List<String> getPositionsForPlayers(int numberOfPlayers) {
        List<String> positions = new ArrayList<>();
        if (numberOfPlayers == 8) {
            // Example positions for 8v8
            positions.addAll(Arrays.asList("Goalkeeper", "Right Back", "Center Back", "Left Back", "Midfielder", "Right winger", "Left winger", "Forward"));
        } else if (numberOfPlayers == 11) {
            // Example positions for 11v11
            positions.addAll(Arrays.asList("Goalkeeper", "Right Back", "Center Back", "Center Back", "Left Back", "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder", "Right Winger", "Left Winger", "Striker"));
        } else {
            // Adjust accordingly or throw an exception
            throw new IllegalArgumentException("Unsupported number of players: " + numberOfPlayers);
        }
        return positions;
    }





    // **Method to Manually Assign Teams**
    public void manualAssignTeams(String formationId, Map<String, List<PlayerAssignment>> teamAssignments) {
        Optional<Formation> formationOpt = getFormationById(formationId);
        if (formationOpt.isPresent()) {
            Formation formation = formationOpt.get();

            // Validate and process teamAssignments as needed

            formation.assignTeams(teamAssignments, new ArrayList<>(teamAssignments.keySet()));
            formationRepository.save(formation);
        }
    }

}

