package com.example.abalacticos.service;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Club;
import com.example.abalacticos.model.RegistrationDto;
import com.example.abalacticos.repository.InventoryRepository;
import com.example.abalacticos.model.Inventory;
import com.example.abalacticos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

import java.time.LocalDate;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private InventoryRepository inventoryRepository;


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


}
