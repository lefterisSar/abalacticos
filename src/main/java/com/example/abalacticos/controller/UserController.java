package com.example.abalacticos.controller;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Match;
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
        try {
            userService.registerUserAdmin(registrationDto);
            return ResponseEntity.ok("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody @Valid RegistrationDto registrationDto) {
        try {
            userService.registerUser(registrationDto);
            return ResponseEntity.ok("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/fetchByIds")
    public ResponseEntity<List<AbalacticosUser>> fetchUsersByIds(@RequestBody List<String> ids) {
        List<AbalacticosUser> users = userService.findUsersByIds(ids);
        return ResponseEntity.ok(users);
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

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/updateAvailability")
    public ResponseEntity<?> updateAvailability(@RequestBody AbalacticosUser user) {
        userService.updateAvailability(user);
        return ResponseEntity.ok("Availability updated successfully");
    }

    @PutMapping("/{id}/absentDates")
    public ResponseEntity<?> updateAbsentDates(@PathVariable String id, @RequestBody List<String> absentDates) {
        try {
            userService.updateAbsentDates(id, absentDates); // Call the service layer to handle the update
            return ResponseEntity.ok("Absent dates updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/absentDates")
    public ResponseEntity<List<String>> getAbsentDates(@PathVariable String id) {
        List<String> absentDates = userService.getAbsentDates(id);
        return ResponseEntity.ok(absentDates);
    }

// Other CRUD operations if needed
}
