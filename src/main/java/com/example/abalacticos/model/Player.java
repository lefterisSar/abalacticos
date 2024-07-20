package com.example.abalacticos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.userdetails.User;

import java.util.Date;

@Document(collection = "players")
public record Player(
        @Id String id,
        String name,
        String surname,
        int age,
        Date debutDate,
        Date lastGK,
        int wins,
        int loses,
        int draws,
        String invitationFriend,
        String favClub,
        String sn,
        Date birthday,
        CommunicationDetails communicationDetails,
        @DBRef AbalacticosUser user
) {
}
