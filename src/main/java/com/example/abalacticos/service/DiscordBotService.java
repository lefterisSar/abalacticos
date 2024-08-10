package com.example.abalacticos.service;

import io.github.cdimascio.dotenv.Dotenv;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.MessageChannel;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class DiscordBotService extends ListenerAdapter {

    private JDA jda;

    @PostConstruct
    public void startBot() throws Exception {
        Dotenv dotenv = Dotenv.load();
        String token = dotenv.get("DISCORD_BOT_TOKEN");
        // Initialize JDA with your bot token
        jda = JDABuilder.createDefault(token)
                .addEventListeners(this) // Add this class as an event listener
                .build();
    }

    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        // Prevent bot from responding to its own messages
        if (event.getAuthor().isBot()) return;

        MessageChannel channel = event.getChannel();
        User author = event.getAuthor();

        // Example: Responding to a command
        String message = event.getMessage().getContentRaw();
        if (message.equalsIgnoreCase("!hello")) {
            channel.sendMessage("Hello, " + author.getName() + "!").queue();
        }
    }

    public void sendMessageToChannel(String channelId, String message) {
        MessageChannel channel = jda.getTextChannelById(channelId);
        if (channel != null) {
            channel.sendMessage(message).queue();
        }
    }
}
