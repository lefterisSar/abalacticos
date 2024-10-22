package com.example.abalacticos.service;

import com.example.abalacticos.model.FidelityRating;
import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.repository.FidelityRatingRepository;
import com.example.abalacticos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class FidelityRatingService {
    @Autowired
    private FidelityRatingRepository fidelityRatingRepository;

    @Autowired
    private UserRepository userRepository;

    // **Calculate Semester Rating**
    public void calculateSemesterRatings(int semester, int year) {
        List<AbalacticosUser> users = userRepository.findAll();

        for (AbalacticosUser user : users) {
            // Logic to calculate semesterRating based on user's participation data
            double semesterRating = calculateUserSemesterRating(user, semester, year);

            // Fetch existing FidelityRating or create a new one
            FidelityRating fidelityRating = fidelityRatingRepository.findByUserIdAndSemesterAndYear(user.getId(), semester, year)
                    .orElse(new FidelityRating());

            fidelityRating.setUserId(user.getId());
            fidelityRating.setSemester(semester);
            fidelityRating.setYear(year);
            fidelityRating.setSemesterRating(semesterRating);

            // Calculate yearly rating
            double yearlyRating = calculateUserYearlyRating(user, year);
            fidelityRating.setYearlyRating(yearlyRating);

            fidelityRatingRepository.save(fidelityRating);

            // **Clean up participation data for the semester**
            cleanupUserParticipationData(user, semester, year);
        }
    }

    private double calculateUserSemesterRating(AbalacticosUser user, int semester, int year) {
        // Implement your calculation logic here
        // This is a placeholder
        return 0.0;
    }

    private double calculateUserYearlyRating(AbalacticosUser user, int year) {
        // Aggregate semester ratings for the year
        List<FidelityRating> semesterRatings = fidelityRatingRepository.findByUserIdAndYear(user.getId(), year);

        double totalRating = semesterRatings.stream()
                .mapToDouble(FidelityRating::getSemesterRating)
                .sum();

        return totalRating / semesterRatings.size();
    }

    private void cleanupUserParticipationData(AbalacticosUser user, int semester, int year) {
        // Remove participation data for the semester
        List<AbalacticosUser.MatchParticipation> updatedParticipations = user.getMatchParticipations().stream()
                .filter(mp -> !isParticipationInSemester(mp, semester, year))
                .toList();

        user.setMatchParticipations(updatedParticipations);
        userRepository.save(user);
    }

    private boolean isParticipationInSemester(AbalacticosUser.MatchParticipation mp, int semester, int year) {
        LocalDate date = mp.getInvitationSentTime().toLocalDate();
        int mpYear = date.getYear();
        int mpMonth = date.getMonthValue();

        if (mpYear != year) return false;

        switch (semester) {
            case 1: return mpMonth >= 1 && mpMonth <= 3;
            case 2: return mpMonth >= 4 && mpMonth <= 6;
            case 3: return mpMonth >= 7 && mpMonth <= 9;
            case 4: return mpMonth >= 10 && mpMonth <= 12;
            default: return false;
        }
    }
}
