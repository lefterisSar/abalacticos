// TokenService.java
package com.example.abalacticos.service;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class TokenService {

    // A real implementation would use a database or cache
    private final Set<String> blacklistedTokens = new HashSet<>();

    public void invalidateToken(String token) {
        System.out.println("blackListed user: " +token);
        blacklistedTokens.add(token);
    }

    public boolean isTokenValid(String token) {
        return !blacklistedTokens.contains(token);
    }
}