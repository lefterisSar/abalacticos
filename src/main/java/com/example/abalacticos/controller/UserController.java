package com.example.abalacticos.controller;

import com.example.abalacticos.model.*;


import com.example.abalacticos.model.UpdateDtos.UpdatePasswordDto;
import com.example.abalacticos.model.UpdateDtos.UpdateUsernameDto;
import com.example.abalacticos.service.UserService;
import com.example.abalacticos.repository.ClubRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Collections;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private ClubRepository clubRepository;


    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    public UserController(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
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

    /*
    // New endpoint for updating user details
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody AbalacticosUser updatedUser) {
        System.out.println("Updating user: " + updatedUser.getUsername());
        userService.updateUser(id, updatedUser);
        return ResponseEntity.ok("User updated successfully");
    }
    */


    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody AbalacticosUser updatedUser, Principal principal) {
        AbalacticosUser existingUser = userService.findPlayerById(id);

        // Check if the authenticated user is an admin
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        // Check if the authenticated user is the same as the user being updated
        boolean isOwner = principal.getName().equals(existingUser.getUsername());

        // If the user is an admin, allow them to update any field
        if (isAdmin) {
            userService.updateUser(id, updatedUser);
            return ResponseEntity.ok("User updated successfully (Admin).");
        }

        // If the user is not an admin but is the owner, restrict them to updating only certain fields
        if (isOwner) {
                existingUser.setAbsent(updatedUser.isAbsent());

                existingUser.setInjured(updatedUser.isInjured());

                existingUser.setAvailable(updatedUser.isAvailable());

                existingUser.setPositionRatings(updatedUser.getPositionRatings());

                existingUser.setOwnedShirts(updatedUser.getOwnedShirts());


            if (updatedUser.getFavClub() != null && updatedUser.getFavClub().getId() != null) {
                Club favClub = clubRepository.findById(updatedUser.getFavClub().getId())
                        .orElseThrow(() -> new RuntimeException("Club not found"));
                existingUser.setFavClub(updatedUser.getFavClub());
            }


            userService.updateUser(id, existingUser);
            return ResponseEntity.ok("User updated successfully - Absent,Injured,Available, Positions (User).");
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to update this user.");
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

    @GetMapping("/{id}")
    public ResponseEntity<AbalacticosUser> getPlayer(@PathVariable String id) {
        return ResponseEntity.ok(userService.findPlayerById(id));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Principal principal) {
        if (principal != null) {
            AbalacticosUser user = userService.getUserProfile(principal.getName());
            return ResponseEntity.ok(user);  // Ensure the user object includes all required fields
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
    }

    @GetMapping("/search")
    public ResponseEntity<List<AbalacticosUser>> searchUsers(@RequestParam(value = "query", required = false) String query) {
        List<AbalacticosUser> users;

        if (query != null && !query.isEmpty()) {
            users = userService.searchUsersByUsername(query);
        } else {
            users = userService.getAllUsers();
        }

        return ResponseEntity.ok(users);
    }

    @PutMapping("/update-username")
    public ResponseEntity<?> updateUsername(@RequestBody UpdateUsernameDto updateRequest, Authentication authentication) {
        // Fetch the current username from the Authentication object
        String currentUsername = authentication.getName();
        // Look up the user from the database using the current username
        AbalacticosUser user = userService.findUserByUsername(currentUsername);

        // Now update the username as per your service logic
        return userService.updateUsername(user, updateRequest);
    }


    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody UpdatePasswordDto updateRequest, Authentication authentication) {
        // Fetch the current username from the Authentication object
        String currentUsername = authentication.getName();
        // Fetch the user using the username
        AbalacticosUser user = userService.findUserByUsername(currentUsername);

        //update password
        return userService.updatePassword(user, updateRequest);
    }

// Other CRUD operations if needed
}
