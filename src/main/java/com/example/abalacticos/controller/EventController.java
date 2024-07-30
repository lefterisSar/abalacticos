package com.example.abalacticos.controller;

import com.example.abalacticos.model.Event;
import com.example.abalacticos.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
