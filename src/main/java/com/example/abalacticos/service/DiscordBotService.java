package com.example.abalacticos.service;

import com.example.abalacticos.model.AbalacticosUser;
import io.github.cdimascio.dotenv.Dotenv;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.MessageChannel;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.components.ActionRow;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class DiscordBotService extends ListenerAdapter {

    private JDA jda;


    private final MatchService matchService;

    @Autowired
    public DiscordBotService(MatchService matchService) {
        this.matchService = matchService;
    }

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

    public void sendAvailabilityButtons(AbalacticosUser user, String matchDate, String matchID) {
        String discordId = user.getDiscordID();
        if (discordId == null || discordId.isEmpty()) {
            System.err.println("User " + user.getUsername() + " does not have a valid Discord ID.");
            return;
        }

        // Get the Discord user by their ID
        User discordUser = jda.retrieveUserById(discordId).complete();

        if (discordUser != null) {
            // Open a private channel (DM) with the user
            discordUser.openPrivateChannel().queue((privateChannel) -> {
                // Send the message with buttons in the private channel
                privateChannel.sendMessage("Are you available for the match on " + matchDate + "?")
                    .setActionRows(
                        ActionRow.of(
                            Button.primary("available:" + user.getId() + ":" + matchID + ":" + user.getDiscordID(), "Available"),
                            Button.danger("not-available:" + user.getId() + ":" + matchID + ":" + user.getDiscordID(), "Not Available")
                        )
                    ).queue();
            }, failure -> {
                System.err.println("Failed to open private channel with user " + user.getUsername() + ".");
            });
        } else {
            System.err.println("Failed to retrieve Discord user for ID: " + discordId);
        }
    }

        // Listen for button interactions
        @Override
        public void onButtonInteraction(ButtonInteractionEvent event) {
            String[] split = event.getComponentId().split(":");
            String action = split[0];
            String playerId = split[1];
            String matchID = split[2];
            String discordID = split[3];

            if (event.getUser().getId().equals(discordID)) {
                switch (action) {
                    case "available":
                        event.reply("Thank you! You are marked as available.").queue();
                        matchService.updatePlayerStatus(matchID, playerId, "available");
                        // Handle marking the user as available in your system.
                        break;
                    case "not-available":
                        event.reply("Thank you! You are marked as not available.").queue();
                        matchService.updatePlayerStatus(matchID, playerId, "not-available");
                        // Handle marking the user as not available in your system.
                        break;
                    case "TBD":
                        matchService.updatePlayerStatus(matchID, playerId, "TBD");
                        // Handle confirming the match in your system.
                        break;
                }
            } else {
                event.reply("This button is not for you!").setEphemeral(true).queue();
            }
        }


}
