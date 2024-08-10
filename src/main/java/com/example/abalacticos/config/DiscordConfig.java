package com.example.abalacticos.config;

import io.github.cdimascio.dotenv.Dotenv;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DiscordConfig {

    @Bean
    public JDA jda() throws Exception {
        Dotenv dotenv = Dotenv.load();
        String token = dotenv.get("DISCORD_BOT_TOKEN");
        return JDABuilder.createDefault(token)
            .build();
    }
}
