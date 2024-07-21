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
            AbalacticosUser user = new AbalacticosUser(
                registrationDto.getUsername(),
                passwordEncoder.encode(registrationDto.getPassword()),
                "USER", // Default role
                registrationDto.getWins(),
                registrationDto.getDraws(),
                registrationDto.getLosses()
            );
        return userRepository.save(user);
    }

    public AbalacticosUser registerUser(RegistrationDto registrationDto)
    {
        AbalacticosUser user = new AbalacticosUser(
                registrationDto.getUsername(),
                passwordEncoder.encode(registrationDto.getPassword())
        );
        return userRepository.save(user);
    }

    public List<AbalacticosUser> getAllUsers() {
        return userRepository.findAll();
    }

    // Other service methods
}
