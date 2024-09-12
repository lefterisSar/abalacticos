package com.example.abalacticos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "clubs")
public class Club {

    @Id
    private String id;
    private String clubName;
    private String iconUrl;

    // Constructors
    public Club() {
    }

    public Club(String clubName, String iconUrl) {
        this.clubName = clubName;
        this.iconUrl = iconUrl;
    }

    public Club(String id, String clubName, String iconUrl) {
        this.id = id;
        this.clubName = clubName;
        this.iconUrl = iconUrl;

    }
    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClubName() {
        return clubName;
    }

    public void setClubName(String clubName) {
        this.clubName = clubName;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }
}
