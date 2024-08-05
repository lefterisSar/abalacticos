package com.example.abalacticos.service;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.RegistrationDto;
import com.example.abalacticos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


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
        newUser.setAge(registrationDto.getAge());
        newUser.setDebutDate(registrationDto.getDebutDate());
        newUser.setLastGK(registrationDto.getLastGK());
        newUser.setWins(registrationDto.getWins());
        newUser.setLosses(registrationDto.getLosses());
        newUser.setDraws(registrationDto.getDraws());
        newUser.setInvitationFriend(registrationDto.getInvitationFriend());
        newUser.setFavClub(registrationDto.getFavClub());
        newUser.setSn(registrationDto.getSn());
        newUser.setBirthday(registrationDto.getBirthday());
        newUser.setCommunicationDetails(registrationDto.getCommunicationDetails());
        newUser.setAvailability(registrationDto.getAvailability());
        newUser.setOverallApps(registrationDto.getOverallApps());
    }


    public void updateUser(String id, AbalacticosUser updatedUser) {
        AbalacticosUser existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setUsername(updatedUser.getUsername());
//        existingUser.setPassword(updatedUser.getPassword() != null ? passwordEncoder.encode(updatedUser.getPassword()) : existingUser.getPassword());
        existingUser.setRoles(updatedUser.getRoles());
        existingUser.setDraws(updatedUser.getDraws());
        existingUser.setWins(updatedUser.getWins());
        existingUser.setLosses(updatedUser.getLosses());
        existingUser.setCommunicationDetails(updatedUser.getCommunicationDetails());
        existingUser.setAvailability(updatedUser.getAvailability());
        existingUser.setOverallApps(updatedUser.getOverallApps());
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
        for (String playerId : playerIds) {
            AbalacticosUser user = userRepository.findById(playerId).orElseThrow(() -> new RuntimeException("User not found"));
            user.setOverallApps(user.getOverallApps() + 1);
            userRepository.save(user);
        }
    }

}
