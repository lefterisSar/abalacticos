package com.example.abalacticos;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.example.abalacticos.model.Player;
import com.example.abalacticos.model.CommunicationDetails;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;

public class PlayerSerializationTest {

    @Test
    public void testPlayerSerialization() {
        // Create a sample Player object using the record constructor
        CommunicationDetails communicationDetails = new CommunicationDetails("123-456-7890",
                "123 Street Name", "ronaldo@example.com");

        Player player = new Player(
                null, // id
                "RONALDO",
                "RONALDO1",
                40,
                null, // debutDate
                null, // lastGK
                1, // wins
                1, // loses
                1, // draws
                null, // invitationFriend
                null, // favClub
                null, // sn
                null, // birthday
                communicationDetails
        );

        try {
            // Create ObjectMapper
            ObjectMapper objectMapper = new ObjectMapper();
            // Enable pretty printing
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

            // Convert Player object to JSON string
            String jsonString = objectMapper.writeValueAsString(player);

            // Expected JSON string
            String expectedJsonString = """
                {
                  "id": null,
                  "name": "RONALDO",
                  "surname": "RONALDO1",
                  "age": 40,
                  "debutDate": null,
                  "lastGK": null,
                  "wins": 1,
                  "loses": 1,
                  "draws": 1,
                  "invitationFriend": null,
                  "favClub": null,
                  "sn": null,
                  "birthday": null,
                  "communicationDetails": {
                    "phoneNumber": "123-456-7890",
                    "address": "123 Street Name",
                    "email": "ronaldo@example.com"
                  }
                }
                """;

            // Compare the actual JSON with the expected JSON
            System.out.println(expectedJsonString);
            assertEquals(objectMapper.readTree(expectedJsonString), objectMapper.readTree(jsonString));
        } catch (Exception e) {
            e.printStackTrace();
            fail("Exception occurred during serialization");
        }
    }
}
