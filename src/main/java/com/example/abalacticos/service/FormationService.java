package com.example.abalacticos.service;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Formation;
import com.example.abalacticos.model.FormationDTOS.FormationRequest;
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
    public Formation createFormation(LocalDateTime dateTime, int numberOfPlayers, int autoFillPlayersCount, int manualFillPlayersCount, List<String> manualPlayerIds, List<String> unregisteredPlayerNames) {
        Formation formation = new Formation(dateTime, numberOfPlayers, autoFillPlayersCount, manualFillPlayersCount);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        formation.setCreatedBy(username);
        formation.setCreatedAt(LocalDateTime.now());

        // Validate manual player IDs and ensure they meet the criteria
        final List<String> validManualPlayerIds;
        if (manualPlayerIds != null && !manualPlayerIds.isEmpty()) {
            validManualPlayerIds = manualPlayerIds.stream()
                    .filter(id -> {
                        AbalacticosUser user = userRepository.findById(id).orElse(null);
                        if (user == null) return false;

                        // Check if user is banned
                        if (user.isBanned()) return false;

                        // Player is not injured or absent, or they are marked as available
                        boolean isEligible = (!user.isInjured() && !user.isAbsent()) || user.isAvailable();

                        // Player's availability matches the day of the formation
                        boolean isAvailableOnDay = user.getAvailability() != null &&
                                user.getAvailability().stream()
                                        .anyMatch(day -> day.equalsIgnoreCase(dateTime.getDayOfWeek().toString()));

                        return isEligible && isAvailableOnDay;
                    })
                    .collect(Collectors.toList());
        } else {
            validManualPlayerIds = new ArrayList<>();
        }

        // Calculate remaining slots for autofill
        int remainingSlots = numberOfPlayers - validManualPlayerIds.size();

        // Fetch eligible players for autofill, excluding manually selected players
        List<AbalacticosUser> eligiblePlayers = userRepository.findAll().stream()
                .filter(user -> {
                    // Exclude manually selected players
                    if (validManualPlayerIds.contains(user.getId())) return false;

                    // Check if user is banned
                    if (user.isBanned()) return false;

                    // Player is not injured or absent, or they are marked as available
                    boolean isEligible = (!user.isInjured() && !user.isAbsent()) || user.isAvailable();

                    // Player's availability matches the day of the formation
                    boolean isAvailableOnDay = user.getAvailability() != null &&
                            user.getAvailability().stream()
                                    .anyMatch(day -> day.equalsIgnoreCase(dateTime.getDayOfWeek().toString()));

                    return isEligible && isAvailableOnDay;
                })
                .collect(Collectors.toList());

        // Adjust autofill count based on available players
        int autoFillCount = Math.min(remainingSlots, eligiblePlayers.size());

        // Shuffle and select players for autofill
        Collections.shuffle(eligiblePlayers);
        List<String> autoFillPlayerIds = eligiblePlayers.stream()
                .limit(autoFillCount)
                .map(AbalacticosUser::getId)
                .collect(Collectors.toList());

        // Combine manual and autofilled player IDs
        List<String> allPlayerIds = new ArrayList<>();
        allPlayerIds.addAll(validManualPlayerIds);
        allPlayerIds.addAll(autoFillPlayerIds);

        //autofillcount
        formation.setAutoFillPlayersCount(autoFillPlayerIds.size());

        //Calculate remaining slots after auto-fill
        remainingSlots = numberOfPlayers - allPlayerIds.size();

        // Initialize the list for unregistered player names in the formation
        List<String> unregisteredPlayerNamesInFormation = new ArrayList<>();

        if (remainingSlots > 0) {
            // Handle unregistered player names provided by the admin
            if (unregisteredPlayerNames != null && !unregisteredPlayerNames.isEmpty()) {
                int namesToAdd = Math.min(remainingSlots, unregisteredPlayerNames.size());
                unregisteredPlayerNamesInFormation.addAll(unregisteredPlayerNames.subList(0, namesToAdd));
                remainingSlots -= namesToAdd;
            }

            // Fill any remaining slots with placeholders
            for (int i = 0; i < remainingSlots; i++) {
                unregisteredPlayerNamesInFormation.add("Player " + (allPlayerIds.size() + unregisteredPlayerNamesInFormation.size() + 1));
            }
        }

        // Set the player IDs and unregistered player names in the formation
        formation.setPlayerIds(allPlayerIds);
        formation.setUnregisteredPlayerNames(unregisteredPlayerNamesInFormation);

        // Save and return the formation
        return formationRepository.save(formation);
    }


    private List<AbalacticosUser> getAutoFillPlayers(LocalDate date, int autoFillPlayersCount, List<String> excludedPlayerIds) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        String dayName = dayOfWeek.toString(); // e.g., "MONDAY"

        // Fetch available players using repository method
        List<AbalacticosUser> availablePlayers = userRepository.findByAvailabilityContainingAndInjuredFalseAndAbsentFalseAndIsBannedFalse(dayName)
                .stream()
                .filter(player -> !excludedPlayerIds.contains(player.getId()))
                .filter(player -> player.getAbsentDates() == null || !player.getAbsentDates().contains(date.toString()))
                .collect(Collectors.toList());

        if (availablePlayers.size() < autoFillPlayersCount) {
            throw new IllegalArgumentException("Not enough available players to auto-fill.");
        }

        // Shuffle and select random players
        Collections.shuffle(availablePlayers);
        return availablePlayers.subList(0, autoFillPlayersCount);
    }

    private boolean isPlayerAvailableOnDate(AbalacticosUser player, LocalDate date) {
        // Check if the player is available on the given date
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        String dayName = dayOfWeek.toString();

        // Check if player's availability includes the day
        if (player.getAvailability() == null || !player.getAvailability().contains(dayName)) {
            return false;
        }

        // Check if the player has marked the date as absent
        if (player.getAbsentDates() != null && player.getAbsentDates().contains(date.toString())) {
            return false;
        }

        return true;
    }


    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    public Optional<Formation> getFormationById(String id) {
        return formationRepository.findById(id);
    }

    public Formation updateFormation(String id, FormationRequest formationRequest) {
        Optional<Formation> optionalFormation = formationRepository.findById(id);
        if (!optionalFormation.isPresent()) {
            throw new RuntimeException("Formation not found with id " + id);
        }

        Formation formation = optionalFormation.get();
        // Update the formation fields based on the request
        formation.setDateTime(formationRequest.getDateTime());
        formation.setNumberOfPlayers(formationRequest.getNumberOfPlayers());
        // ... update other fields as needed

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
            List<String> confirmedPlayers = formation.getPlayerIds(); // Assuming this list has confirmed players

            // Shuffle the list for randomness
            Collections.shuffle(confirmedPlayers);

            // Split the list into two teams
            int midIndex = confirmedPlayers.size() / 2;
            List<String> team1 = confirmedPlayers.subList(0, midIndex);
            List<String> team2 = confirmedPlayers.subList(midIndex, confirmedPlayers.size());

            // Assign colors
            List<String> colorsAssigned = new ArrayList<>();
            String color1 = formation.getAvailableColors().get(0);
            String color2 = formation.getAvailableColors().get(1);
            colorsAssigned.add(color1);
            colorsAssigned.add(color2);

            Map<String, List<String>> teamAssignments = new HashMap<>();
            teamAssignments.put(color1, new ArrayList<>(team1));
            teamAssignments.put(color2, new ArrayList<>(team2));

            formation.assignTeams(teamAssignments, colorsAssigned);
            formationRepository.save(formation);
        }
    }

    // **Method to Manually Assign Teams**
    public void manualAssignTeams(String formationId, Map<String, List<String>> teamAssignments) {
        Optional<Formation> formationOpt = getFormationById(formationId);
        if (formationOpt.isPresent()) {
            Formation formation = formationOpt.get();

            // Extract colors assigned
            List<String> colorsAssigned = new ArrayList<>(teamAssignments.keySet());

            formation.assignTeams(teamAssignments, colorsAssigned);
            formationRepository.save(formation);
        }
    }

}

