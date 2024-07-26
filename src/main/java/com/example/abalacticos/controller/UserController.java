package com.example.abalacticos.controller;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.RegistrationDto;
import com.example.abalacticos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

//    @PreAuthorize("hasRole('ADMIN')") TODO: Fix this along with backend ROLES.
    @PostMapping("/registerAdmin")
    public ResponseEntity<?> registerUserAdmin(@RequestBody @Valid RegistrationDto registrationDto) {
        System.out.println("Registering user: " + registrationDto.getUsername());
        AbalacticosUser newUser = userService.registerUserAdmin(registrationDto);
        return ResponseEntity.ok("User registered successfully");
    }

  @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody @Valid RegistrationDto registrationDto) {
        System.out.println("Registering user: " + registrationDto.getUsername());
        AbalacticosUser newUser = userService.registerUser(registrationDto);
        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping
    public List<AbalacticosUser> getAllUsers() {
        return userService.getAllUsers();
    }

    // Other CRUD operations if needed
}
