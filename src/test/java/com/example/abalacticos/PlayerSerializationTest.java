package com.example.abalacticos;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.example.abalacticos.model.Player;
import com.example.abalacticos.model.CommunicationDetails;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class PlayerSerializationTest {

    @Test
    public void testPlayerSerialization() {
        Player player = new Player();
        player.setName("RONALDO");
        player.setSurname("RONALDO1");
        player.setAge(40);
        // Set other fields as necessary...

        // Set communication details
        CommunicationDetails communicationDetails = new CommunicationDetails();
        communicationDetails.setPhoneNumber("123-456-7890");
        communicationDetails.setAddress("123 Street Name");
        communicationDetails.setEmail("ronaldo@example.com");
        player.setCommunicationDetails(communicationDetails);

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
                  "wins": 0,
                  "loses": 0,
                  "draws": 0,
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
