package com.example.abalacticos.controller;

import com.example.abalacticos.service.DiscordBotService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discord")
public class DiscordBotController {

    @Autowired
    private DiscordBotService discordBotService;


    @PostMapping("/{channelId}/send")
    public void sendMessage(@PathVariable String channelId, @RequestBody String payload) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);
        String message = jsonNode.get("message").asText(); // Extract the message field
        discordBotService.sendMessageToChannel(channelId, message);
    }
}
