package com.example.abalacticos.controller;

import com.example.abalacticos.model.*;


import com.example.abalacticos.model.Dtos.*;
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

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

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

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable String id, @RequestBody BanRequestDto banRequest) {
        try {
            userService.banUser(id, banRequest);
            return ResponseEntity.ok("User has been banned successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/goodBoi")
    public ResponseEntity<?> unbanUser(@PathVariable String id) {
        try {
            userService.unbanUser(id);
            return ResponseEntity.ok("User has been unbanned successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint to get completed ban history
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/ban-history/completed")
    public ResponseEntity<List<BanHistoryDto>> getCompletedBanHistory() {
        return ResponseEntity.ok(userService.getCompletedBanHistory());
    }

    // Endpoint to get currently banned users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/ban-history/current")
    public ResponseEntity<List<BanHistoryDto>> getCurrentBannedUsers() {
        return ResponseEntity.ok(userService.getCurrentBannedUsers());
    }

    @GetMapping("/{id}/fidelity-rating")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserFidelityRating(@PathVariable String id, @RequestParam int year) {
        FidelityRating rating = userService.getUserFidelityRating(id, year);
        if (rating != null) {
            return ResponseEntity.ok(rating);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fidelity rating not found for the specified year.");
        }
    }

    // Fetch Available Players (Not injured, not absent, not banned OR available)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/available")
    public ResponseEntity<List<AbalacticosUserDTO>> getAvailablePlayers(@RequestParam("date") String dateStr) {
            LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
            List<AbalacticosUserDTO> availablePlayers = userService.getNonExcludedAvailablePlayersByDateDTO(date);
            return ResponseEntity.ok(availablePlayers);
    }



    // Fetch Injured Players
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/injured")
    public ResponseEntity<List<AbalacticosUserDTO>> getInjuredPlayers(@RequestParam("date") String dateStr) {
        LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
        List<AbalacticosUserDTO> injuredPlayers = userService.getInjuredPlayersByDateDTO(date);
        return ResponseEntity.ok(injuredPlayers);
    }

    // Fetch Absent Players
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/absent")
    public ResponseEntity<List<AbalacticosUserDTO>> getAbsentPlayers(@RequestParam("date") String dateStr) {
        LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
        List<AbalacticosUserDTO> absentPlayers = userService.getAbsentPlayersByDateDTO(date);
        return ResponseEntity.ok(absentPlayers);
    }

    // Fetch Banned Players
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/banned")
    public ResponseEntity<List<AbalacticosUserDTO>> getBannedPlayers(@RequestParam("date") String dateStr) {
        LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
        List<AbalacticosUserDTO> bannedPlayers = userService.getBannedPlayersByDateDTO(date);
        return ResponseEntity.ok(bannedPlayers);
    }

    // Fetch Explicitly Available Players
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/explicitly-available")
    public ResponseEntity<List<AbalacticosUserDTO>> getExplicitlyAvailablePlayers(@RequestParam("date") String dateStr) {
        LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
        List<AbalacticosUserDTO> explicitlyAvailablePlayers = userService.getExplicitlyAvailablePlayersByDateDTO(date);
        return ResponseEntity.ok(explicitlyAvailablePlayers);
    }

    // Fetch All Players
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<AbalacticosUserDTO>> getAllPlayers() {
        List<AbalacticosUserDTO> allPlayers = userService.getAllPlayersDTO();
        return ResponseEntity.ok(allPlayers);
    }



// Other CRUD operations if needed
}
