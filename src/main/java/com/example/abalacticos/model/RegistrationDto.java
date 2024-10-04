package com.example.abalacticos.model;


import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class RegistrationDto {

    @NotEmpty
    private String username;
    @NotEmpty
    private String password;
    @NotEmpty
    private String email;
    private String role;
    private String name;
    private String surname;
    private String debutDate;
    private String lastGK;
    private int wins;
    private int losses;
    private int draws;
    private String invitationFriend;
    private String favClub;
    private String sn;
    private String birthday;
    private int overallApps;
    private List<String> availability;
    private int tuesdayAppearances;
    private int wednesdayAppearances;
    private int fridayAppearances;
    private String discordID;
    private CommunicationDetails communicationDetails;

    private boolean available = false;
    private boolean absent = false;
    private boolean injured = false;
}
