package com.example.abalacticos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "players")
public class Player {
    @Id
    private String id;
    private String name;
    private String surname;
    private int age;
    private Date debutDate;
    private Date lastGK;
    private int wins;
    private int loses;
    private int draws;
    private String invitationFriend;
    private String favClub;
    private String sn;
    private Date birthday;
    private String phoneNumber;
    private String address;
    private String email;

    private CommunicationDetails communicationDetails;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Date getDebutDate() {
        return debutDate;
    }

    public void setDebutDate(Date debutDate) {
        this.debutDate = debutDate;
    }

    public Date getLastGK() {
        return lastGK;
    }

    public void setLastGK(Date lastGK) {
        this.lastGK = lastGK;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getLoses() {
        return loses;
    }

    public void setLoses(int loses) {
        this.loses = loses;
    }

    public int getDraws() {
        return draws;
    }

    public void setDraws(int draws) {
        this.draws = draws;
    }

    public String getInvitationFriend() {
        return invitationFriend;
    }

    public void setInvitationFriend(String invitationFriend) {
        this.invitationFriend = invitationFriend;
    }

    public String getFavClub() {
        return favClub;
    }

    public void setFavClub(String favClub) {
        this.favClub = favClub;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public CommunicationDetails getCommunicationDetails() {
        return communicationDetails;
    }

    public void setCommunicationDetails(CommunicationDetails communicationDetails) {
        this.communicationDetails = communicationDetails;
    }

}
