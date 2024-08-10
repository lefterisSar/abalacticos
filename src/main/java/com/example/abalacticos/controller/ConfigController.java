package com.example.abalacticos.controller;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @GetMapping("/channelId")
    public String getChannelId() {
        Dotenv dotenv = Dotenv.load();
        return dotenv.get("DISCORD_GENERAL_CHANNEL_ID");
    }
}