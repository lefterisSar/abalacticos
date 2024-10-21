package com.example.abalacticos.service;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Club;
import com.example.abalacticos.model.Dtos.BanHistoryDto;
import com.example.abalacticos.model.Dtos.BanRequestDto;
import com.example.abalacticos.model.FidelityRating;
import com.example.abalacticos.model.RegistrationDto;
import com.example.abalacticos.model.Dtos.UpdatePasswordDto;
import com.example.abalacticos.model.Dtos.UpdateUsernameDto;
import com.example.abalacticos.repository.FidelityRatingRepository;
import com.example.abalacticos.repository.InventoryRepository;
import com.example.abalacticos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;

import java.time.LocalDate;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private InventoryRepository inventoryRepository;
    private FidelityRatingRepository fidelityRatingRepository;


    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AbalacticosUser registerUserAdmin(RegistrationDto registrationDto)
    {
        if (userRepository.findByUsername(registrationDto.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        AbalacticosUser newUser = new AbalacticosUser();
        newUser.setUsername(registrationDto.getUsername());
        newUser.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        newUser.setRoles(registrationDto.getRole());
        setPlayerAttributes(newUser, registrationDto);
        return userRepository.save(newUser);
    }

    public AbalacticosUser registerUser(RegistrationDto registrationDto) {
        if (userRepository.findByUsername(registrationDto.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        AbalacticosUser newUser = new AbalacticosUser();
        newUser.setUsername(registrationDto.getUsername());
        newUser.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        newUser.setRoles("USER");
        // Set player attributes
        setPlayerAttributes(newUser, registrationDto);
        return userRepository.save(newUser);
    }

    private void setPlayerAttributes(AbalacticosUser newUser, RegistrationDto registrationDto) {
        newUser.setName(registrationDto.getName());
        newUser.setSurname(registrationDto.getSurname());
        newUser.setDebutDate(registrationDto.getDebutDate());
        newUser.setLastGK(registrationDto.getLastGK());
        newUser.setWins(registrationDto.getWins());
        newUser.setLosses(registrationDto.getLosses());
        newUser.setDraws(registrationDto.getDraws());
        newUser.setInvitationFriend(registrationDto.getInvitationFriend());
        newUser.setSn(registrationDto.getSn());
        newUser.setBirthday(registrationDto.getBirthday());
        newUser.setCommunicationDetails(registrationDto.getCommunicationDetails());
        newUser.setAvailability(registrationDto.getAvailability());
        newUser.setOverallApps(registrationDto.getOverallApps());
        newUser.setTuesdayAppearances(registrationDto.getTuesdayAppearances());
        newUser.setFridayAppearances(registrationDto.getFridayAppearances());
        newUser.setWednesdayAppearances(registrationDto.getWednesdayAppearances());
        newUser.setDiscordID(registrationDto.getDiscordID());
        newUser.setAbsentDates(new ArrayList<>());

        newUser.setAvailable(false);
        newUser.setInjured(false);
        newUser.setAbsent(false);
        newUser.setPositionRatings(new HashMap<>());

        newUser.setFavClub(new Club());


        newUser.setOwnedShirts(new HashSet<>());

    }


    public void updateUser(String id, AbalacticosUser updatedUser) {
        AbalacticosUser existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setSurname(updatedUser.getSurname());
        existingUser.setName(updatedUser.getName());
        existingUser.setSn(updatedUser.getSn());
        existingUser.setRoles(updatedUser.getRoles());
        existingUser.setWins(updatedUser.getWins());
        existingUser.setDraws(updatedUser.getDraws());
        existingUser.setLosses(updatedUser.getLosses());
        existingUser.setCommunicationDetails(updatedUser.getCommunicationDetails());
        existingUser.setAvailability(updatedUser.getAvailability());
        existingUser.setOverallApps(updatedUser.getOverallApps());
        existingUser.setDebutDate(updatedUser.getDebutDate());
        existingUser.setLastGK(updatedUser.getLastGK());
        existingUser.setDiscordID(updatedUser.getDiscordID());
        existingUser.setBirthday(updatedUser.getBirthday());
        existingUser.setDebutDate(updatedUser.getDebutDate());
        //TODO: Below line is not working
        existingUser.setCommunicationDetails(existingUser.getCommunicationDetails());

        existingUser.setAbsentDates(updatedUser.getAbsentDates());

        existingUser.setAvailable(updatedUser.isAvailable());
        existingUser.setAbsent(updatedUser.isAbsent());
        existingUser.setInjured(updatedUser.isInjured());
        existingUser.setPositionRatings(updatedUser.getPositionRatings());

        existingUser.setFavClub(updatedUser.getFavClub());


        existingUser.setOwnedShirts(updatedUser.getOwnedShirts());

        userRepository.save(existingUser);
    }

    public void updateAvailability(AbalacticosUser user) {
        AbalacticosUser existingUser = userRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setAvailability(user.getAvailability());
        userRepository.save(existingUser);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public List<AbalacticosUser> getAllUsers() {
        return userRepository.findAll();
    }

    public void incrementOverallApps(List<String> playerIds) {
        for (String playerId : playerIds)
        {
            Optional<AbalacticosUser> playerOpt = userRepository.findById(playerId);
            if (playerOpt.isPresent()) {
                AbalacticosUser player = playerOpt.get();
                player.setOverallApps(player.getOverallApps() + 1);
                userRepository.save(player);
            }
            else
            {
                System.err.println("Player not found with ID: " + playerId);
            }
        }
    }

    public void incrementDayAppearances(List<String> playerIds, String day) {
        for (String playerId : playerIds)
        {
            Optional<AbalacticosUser> playerOpt = userRepository.findById(playerId);
            if (playerOpt.isPresent()) {
                AbalacticosUser player = playerOpt.get();
                switch (day) {
                    case "Tuesday":
                        player.setTuesdayAppearances(player.getTuesdayAppearances() + 1);
                        break;
                    case "Wednesday":
                        player.setWednesdayAppearances(player.getWednesdayAppearances() + 1);
                        break;
                    case "Friday":
                        player.setFridayAppearances(player.getFridayAppearances() + 1);
                        break;
                }
                userRepository.save(player);
            }
            else
            {
                System.err.println("Player not found with ID: " + playerId);
            }
        }
    }

    public void decrementDayAppearances(List<String> playerIds, String day)
    {
        for (String playerId : playerIds)
        {
            Optional<AbalacticosUser> playerOpt = userRepository.findById(playerId);
            if (playerOpt.isPresent()) {
                AbalacticosUser player = playerOpt.get();
                switch (day) {
                    case "Tuesday":
                        player.setTuesdayAppearances(player.getTuesdayAppearances() - 1);
                        break;
                    case "Wednesday":
                        player.setWednesdayAppearances(player.getWednesdayAppearances() - 1);
                        break;
                    case "Friday":
                        player.setFridayAppearances(player.getFridayAppearances() - 1);
                        break;
                }
                userRepository.save(player);
            }
            else
            {
                System.err.println("Player not found with ID: " + playerId);
            }
        }
    }

    public void decrementOverallApps(List<String> playerIds) {
        for (String playerId : playerIds)
        {
            Optional<AbalacticosUser> playerOpt = userRepository.findById(playerId);
            if (playerOpt.isPresent()) {
                AbalacticosUser player = playerOpt.get();
                player.setOverallApps(player.getOverallApps() - 1);
                userRepository.save(player);
            }
            else
            {
                System.err.println("Player not found with ID: " + playerId);
            }
        }
    }

    public void updateLastGK(List<String> playerIds, LocalDate matchDate) {
        for (String playerId : playerIds)
        {
            Optional<AbalacticosUser> playerOpt = userRepository.findById(playerId);
            if (playerOpt.isPresent()) {
                AbalacticosUser player = playerOpt.get();
                player.setLastGK(matchDate.toString());
                userRepository.save(player);
            }
            else
            {
                System.err.println("Player not found with ID: " + playerId);
            }
        }
    }

    public void incrementWins(List<String> playerIds) {
        for (String playerId : playerIds)
        {
            Optional<AbalacticosUser> playerOpt = userRepository.findById(playerId);
            if (playerOpt.isPresent()) {
                AbalacticosUser player = playerOpt.get();
                player.setWins(player.getWins() + 1);
                userRepository.save(player);
            }
            else
            {
                System.err.println("Player not found with ID: " + playerId);
            }
        }
    }

    public void incrementLosses(List<String> playerIds) {
        for (String playerId : playerIds)
        {
            Optional<AbalacticosUser> playerOpt = userRepository.findById(playerId);
            if (playerOpt.isPresent()) {
                AbalacticosUser player = playerOpt.get();
                player.setLosses(player.getLosses() + 1);
                userRepository.save(player);
            }
            else
            {
                System.err.println("Player not found with ID: " + playerId);
            }
        }
    }

    public void incrementDraws(List<String> playerIds) {
        for (String playerId : playerIds)
        {
            Optional<AbalacticosUser> playerOpt = userRepository.findById(playerId);
            if (playerOpt.isPresent()) {
                AbalacticosUser player = playerOpt.get();
                player.setDraws(player.getDraws() + 1);
                userRepository.save(player);
            }
            else
            {
                System.err.println("Player not found with ID: " + playerId);
            }
        }
    }

    public void updateAbsentDates(String id, List<String> absentDates) {
        AbalacticosUser existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        // Update the absent dates
        existingUser.setAbsentDates(absentDates);

        // Save the updated user back to the database
        userRepository.save(existingUser);
    }

    public List<String> getAbsentDates(String id){
        AbalacticosUser existingUser =userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return existingUser.getAbsentDates();
    }

    public List<AbalacticosUser> findUsersByIds(List<String> ids) {
        return userRepository.findAllById(ids);
    }

    public AbalacticosUser findPlayerById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AbalacticosUser getUserProfile(String username) {
        return userRepository.findByUsername(username);
    }



    // Fetch the user's owned shirts
    public Set<String> getOwnedShirts(String userId) {
        Optional<AbalacticosUser> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            AbalacticosUser user = userOptional.get();
            return user.getOwnedShirts();  // Ensure this getter exists in AbalacticosUser
        } else {
            throw new RuntimeException("User not found"); // Handle user not found case
        }
    }

    public List<AbalacticosUser> searchUsersByUsername(String query) {
        return userRepository.findByUsernameContainingIgnoreCase(query); // Assuming a method exists in your repository
    }

    public AbalacticosUser findUserByUsername(String username) {
        return userRepository.findOptionalByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }


    public ResponseEntity<?> updateUsername(AbalacticosUser user, UpdateUsernameDto updateRequest) {
        if (userRepository.existsByUsername(updateRequest.getNewUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        user.setUsername(updateRequest.getNewUsername());
        userRepository.save(user);
        return ResponseEntity.ok("Username updated successfully");
    }

    public ResponseEntity<?> updatePassword(AbalacticosUser user, UpdatePasswordDto updateRequest) {
        if (!passwordEncoder.matches(updateRequest.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }

        if (!updateRequest.getNewPassword().equals(updateRequest.getConfirmNewPassword())) {
            return ResponseEntity.badRequest().body("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(updateRequest.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Password updated successfully");
    }

    public void banUser(String userId, BanRequestDto banRequest) {
        AbalacticosUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Set the ban start date to now if it's not provided
        LocalDateTime banStartDate = banRequest.getBanStartDate() != null ? banRequest.getBanStartDate() : LocalDateTime.now();
        user.setBanStartDate(banStartDate);

        // Allow banEndDate to remain null for indefinite bans
        user.setBanEndDate(banRequest.getBanEndDate());
        user.setBanReason(banRequest.getBanReason() != null ? banRequest.getBanReason() : "No reason provided");

        user.setBanned(true);
        user.setBanCount(user.getBanCount() + 1);
        userRepository.save(user);
    }

    // Method to automatically unban a user after the ban period ends
    public void checkForBanExpiry() {
        List<AbalacticosUser> bannedUsers = userRepository.findAllByIsBannedTrue();
        for (AbalacticosUser user : bannedUsers) {
            if (user.getBanEndDate() != null && user.getBanEndDate().isBefore(LocalDateTime.now())) {
                user.setBanned(false);
                user.setBanStartDate(null);
                user.setBanEndDate(null);
                userRepository.save(user);
            }
        }
    }

    public void unbanUser(String userId) {
        AbalacticosUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBanned(false);
        user.setBanStartDate(null);
        user.setBanEndDate(null);

        userRepository.save(user);
    }



    // Fetching history of all users who have been banned (completed bans)
    public List<BanHistoryDto> getCompletedBanHistory() {
        List<AbalacticosUser> allUsers = userRepository.findAll();
        List<BanHistoryDto> completedBanHistory = new ArrayList<>();

        for (AbalacticosUser user : allUsers) {
            if (user.getBanEndDate() != null && user.getBanEndDate().isBefore(LocalDateTime.now())) {
                long duration = Duration.between(user.getBanStartDate(), user.getBanEndDate()).toDays();

                BanHistoryDto historyDto = new BanHistoryDto(
                        user.getUsername(),
                        user.getBanStartDate(),
                        user.getBanEndDate(),
                        duration,
                        user.getBanReason(),
                        user.getBanCount()
                );
                completedBanHistory.add(historyDto);
            }
        }
        return completedBanHistory;
    }


    // Fetching users who are currently banned
    public List<BanHistoryDto> getCurrentBannedUsers() {
        List<AbalacticosUser> allUsers = userRepository.findAll();
        List<BanHistoryDto> currentBannedUsers = new ArrayList<>();

        for (AbalacticosUser user : allUsers) {
            // Check if user is currently banned
            if (user.isBanned() && (user.getBanEndDate() == null || user.getBanEndDate().isAfter(LocalDateTime.now()))) {
                long duration = user.getBanEndDate() != null ?
                        Duration.between(user.getBanStartDate(), user.getBanEndDate()).toDays() :
                        Duration.between(user.getBanStartDate(), LocalDateTime.now()).toDays();

                BanHistoryDto historyDto = new BanHistoryDto(
                        user.getUsername(),
                        user.getBanStartDate(),
                        user.getBanEndDate(),
                        duration,
                        user.getBanReason(),
                        user.getBanCount()
                );
                currentBannedUsers.add(historyDto);
            }
        }
        return currentBannedUsers;
    }

    public FidelityRating getUserFidelityRating(String userId, int year) {
        // Fetch the latest fidelity rating for the user
        return fidelityRatingRepository.findByUserIdAndYear(userId, year)
                .stream()
                .max(Comparator.comparingInt(FidelityRating::getSemester))
                .orElse(null);
    }


    public void addMatchParticipation(String userId, String matchId, LocalDateTime invitationSentTime) {
        AbalacticosUser user = findPlayerById(userId);
        AbalacticosUser.MatchParticipation participation = new AbalacticosUser.MatchParticipation();
        participation.setMatchId(matchId);
        participation.setStatus("waiting");
        participation.setInvitationSentTime(invitationSentTime);

        if (user.getMatchParticipations() == null) {
            user.setMatchParticipations(new ArrayList<>());
        }
        user.getMatchParticipations().add(participation);
        userRepository.save(user);
    }

    public void updateMatchParticipationStatus(String userId, String matchId, String status, LocalDateTime responseTime) {
        AbalacticosUser user = findPlayerById(userId);
        if (user.getMatchParticipations() != null) {
            for (AbalacticosUser.MatchParticipation participation : user.getMatchParticipations()) {
                if (participation.getMatchId().equals(matchId)) {
                    participation.setStatus(status);
                    participation.setResponseTime(responseTime);
                    break;
                }
            }
            userRepository.save(user);
        }
    }

    public List<AbalacticosUser> getAvailablePlayersForDate(LocalDateTime dateTime) {
        DayOfWeek dayOfWeek = dateTime.getDayOfWeek();
        String dayName = dayOfWeek.toString();

        return userRepository.findAll().stream()
                .filter(user -> {
                    boolean isAvailableOnDay = user.getAvailability() != null &&
                            user.getAvailability().stream()
                                    .anyMatch(day -> day.equalsIgnoreCase(dayName));

                    boolean isAbsentOnDate = user.getAbsentDates() != null &&
                            user.getAbsentDates().contains(dateTime.toLocalDate().toString());

                    return isAvailableOnDay && !isAbsentOnDate && !user.isBanned();
                })
                .collect(Collectors.toList());
    }

    /**
     * Retrieves available players for a given date.
     *
     * @param dateTime The date for which to find available players.
     * @return A list of available players.
     */
    public List<AbalacticosUser> getPlayersByDate(LocalDateTime dateTime) {
        String dayName = dateTime.getDayOfWeek().toString(); // e.g., "MONDAY"

        // Fetch players available on the specified day, case-insensitive
        List<AbalacticosUser> availablePlayers = userRepository.findByAvailabilityIgnoreCase(dayName);

        // Filter out banned, injured, or absent players
        return availablePlayers.stream()
                .filter(user -> !user.isBanned())
                .filter(user -> !user.isInjured())
                .filter(user -> !user.isAbsent())
                .filter(user -> {
                    // Assuming AbalacticosUser has a list of absent dates as strings in "YYYY-MM-DD" format
                    List<String> absentDates = user.getAbsentDates();
                    return absentDates == null || !absentDates.contains(dateTime.toString());
                })
                .collect(Collectors.toList());
    }


}
