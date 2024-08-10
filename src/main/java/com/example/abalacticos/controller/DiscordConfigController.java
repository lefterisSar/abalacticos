package com.example.abalacticos.controller;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/config")
public class DiscordConfigController {

    @GetMapping("/channelId")
    public String getChannelId(@RequestParam String message) {
        Dotenv dotenv = Dotenv.load();
        return switch (message.toLowerCase()) {
            case "general" -> dotenv.get("DISCORD_GENERAL_CHANNEL_ID");
            case "tuesday" -> dotenv.get("DISCORD_TUESDAY_CHANNEL_ID");
            case "wednesday" -> dotenv.get("DISCORD_WEDNESDAY_CHANNEL_ID");
            case "friday" -> dotenv.get("DISCORD_FRIDAY_CHANNEL_ID");
            default -> "Invalid message";
        };
    }
}
