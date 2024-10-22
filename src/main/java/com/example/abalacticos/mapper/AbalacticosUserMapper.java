package com.example.abalacticos.mapper;

import com.example.abalacticos.model.Dtos.AbalacticosUserDTO;
import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Dtos.AbalacticosUserDTO.MatchParticipation;

import java.util.stream.Collectors;



public class AbalacticosUserMapper {
    public static AbalacticosUserDTO toDTO(AbalacticosUser user) {
        AbalacticosUserDTO dto = new AbalacticosUserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setUnavailableDates(user.getUnavailableDates());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setLastGK(user.getLastGK());
        dto.setOverallApps(user.getOverallApps());
        dto.setAvailability(user.getAvailability());
        dto.setTuesdayAppearances(user.getTuesdayAppearances());
        dto.setWednesdayAppearances(user.getWednesdayAppearances());
        dto.setFridayAppearances(user.getFridayAppearances());
        dto.setAbsent(user.isAbsent());
        dto.setInjured(user.isInjured());
        dto.setBanned(user.isBanned());

        if (user.getMatchParticipations() != null) {
            dto.setMatchParticipations(
                    user.getMatchParticipations().stream().map(participation -> {
                        AbalacticosUserDTO.MatchParticipation dtoParticipation = new AbalacticosUserDTO.MatchParticipation();
                        dtoParticipation.setMatchId(participation.getMatchId());
                        dtoParticipation.setStatus(participation.getStatus());
                        dtoParticipation.setInvitationSentTime(participation.getInvitationSentTime());
                        dtoParticipation.setResponseTime(participation.getResponseTime());
                        return dtoParticipation;
                    }).collect(Collectors.toList())
            );
        }


        return dto;
    }
}

