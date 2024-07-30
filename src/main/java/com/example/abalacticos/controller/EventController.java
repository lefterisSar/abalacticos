package com.example.abalacticos.controller;

import com.example.abalacticos.model.Event;
import com.example.abalacticos.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/availability")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Event> getEvents() {
        return eventRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addEvent(@RequestBody Event event, Authentication authentication) {
        String username = authentication.getName();
        event.setUsername(username);
        eventRepository.save(event);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable String id, Authentication authentication) {
        Optional<Event> eventOptional = eventRepository.findById(id);
        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            if (event.getUsername().equals(authentication.getName())) {
                eventRepository.delete(event);
                return ResponseEntity.ok("Event deleted successfully");
            } else {
                return ResponseEntity.status(403).body("You are not authorized to delete this event");
            }
        } else {
            return ResponseEntity.status(404).body("Event not found");
        }
    }
}
