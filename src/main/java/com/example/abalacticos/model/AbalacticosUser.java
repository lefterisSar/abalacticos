package com.example.abalacticos.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.*;

@Document(collection = "abalacticos_users")
@Setter
@Getter
public class AbalacticosUser {
    @Id
    private String id;
    private String username;
    private String password;
    private String roles;
    List<String> unavailableDates;
    private String name;
    private String surname;
    private int wins;
    private int losses;
    private int draws;
    private String debutDate;
    private String lastGK;
    private int overallApps;
    private String invitationFriend;
    private String sn;
    private String birthday;
    private CommunicationDetails communicationDetails;
    private List<String> availability;
    private int tuesdayAppearances;
    private int wednesdayAppearances;
    private int fridayAppearances;
    private String discordID;
    private List<String> absentDates = new ArrayList<>();
    private boolean available = false;
    private boolean absent = false;
    private boolean injured = false;
    private Map<String, Integer> positionRatings = new HashMap<>();

    private Club FavClub  = new Club("66d70e6d9a9e7e27c2d1c634","Abalacticos", ".");

    //04092024 mplouzakia, mpales, gantia, tameio/tameia, pontoi, xwrisma omadwn se paikti, teamrating
    private List<Inventory> ownedItems = new ArrayList<>();
    private boolean canHoldItems = false;
    private Set<String> ownedShirts = new HashSet<>(); // Use Set<String> to store shirt colors

    private boolean isBanned = false;
    private LocalDateTime banStartDate;
    private LocalDateTime banEndDate;
    private String banReason;
    private int banCount = 0;

    public AbalacticosUser() {
        this.positionRatings = new HashMap<>();
        this.positionRatings.put("goalkeeper", 0);
        this.positionRatings.put("rightBack", 1);
        this.positionRatings.put("leftBack", 1);
        this.positionRatings.put("centerBack", 1);
        this.positionRatings.put("midfielder", 1);
        this.positionRatings.put("rightWinger", 1);
        this.positionRatings.put("leftWinger", 1);
        this.positionRatings.put("centerForward", 1);
    }

    public AbalacticosUser(String username) {
        this.username = username;
        this.ownedShirts = new HashSet<>();
    }


    public void addOwnedItem(Inventory item) {
        this.ownedItems.add(item);
    }

    public void removeOwnedItem(Inventory item) {
        this.ownedItems.remove(item);
    }


    // Add a shirt to the user's collection
    public void addShirt(String shirtColor) {
        this.ownedShirts.add(shirtColor);
    }

    // Remove a shirt from the user's collection
    public void removeShirt(String shirtColor) {
        this.ownedShirts.remove(shirtColor);
    }

    public boolean isBanned() {
        return isBanned;
    }

    public void setBanned(boolean banned) {
        this.isBanned = banned;
    }

}
