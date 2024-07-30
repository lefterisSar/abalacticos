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

    @PreAuthorize("hasRole('ADMIN')")
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


    // New endpoint for updating user details
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody AbalacticosUser updatedUser) {
        System.out.println("Updating user: " + updatedUser.getUsername());
        userService.updateUser(id, updatedUser);
        return ResponseEntity.ok("User updated successfully");
    }

    @GetMapping
    public List<AbalacticosUser> getAllUsers() {
        return userService.getAllUsers();
    }

    // Other CRUD operations if needed
}
