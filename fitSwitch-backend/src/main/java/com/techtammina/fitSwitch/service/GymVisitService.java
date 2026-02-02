package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.CheckInRequest;
import com.techtammina.fitSwitch.dto.GymVisitResponse;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.GymRepository;
import com.techtammina.fitSwitch.repository.GymVisitRepository;
import com.techtammina.fitSwitch.repository.MembershipRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class GymVisitService {

    private final GymVisitRepository gymVisitRepository;
    private final MembershipRepository membershipRepository;
    private final GymRepository gymRepository;

    public GymVisitService(GymVisitRepository gymVisitRepository,
                          MembershipRepository membershipRepository,
                          GymRepository gymRepository) {
        this.gymVisitRepository = gymVisitRepository;
        this.membershipRepository = membershipRepository;
        this.gymRepository = gymRepository;
    }

    public GymVisitResponse checkIn(Long userId, CheckInRequest request) {
        // Validate active membership
        Membership activeMembership = membershipRepository
                .findByUserIdAndGymIdAndStatus(userId, request.getGymId(), MembershipStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active membership found for this gym"));

        // Check if user already has an active visit today
        LocalDate today = LocalDate.now();
        gymVisitRepository.findByUserIdAndGymIdAndVisitDateAndStatus(
                userId, request.getGymId(), today, GymVisitStatus.ACTIVE)
                .ifPresent(visit -> {
                    throw new RuntimeException("Already checked in today. Please check out first.");
                });

        // Create new visit
        GymVisit visit = new GymVisit();
        visit.setUserId(userId);
        visit.setGymId(request.getGymId());
        visit.setMembershipId(activeMembership.getId());
        visit.setCheckInTime(LocalDateTime.now());
        visit.setVisitDate(today);
        visit.setStatus(GymVisitStatus.ACTIVE);

        GymVisit savedVisit = gymVisitRepository.save(visit);
        
        // Get gym name for response
        Gym gym = gymRepository.findById(request.getGymId()).orElse(null);
        
        return mapToResponse(savedVisit, gym);
    }

    public GymVisitResponse checkOut(Long userId) {
        // Find active visit
        GymVisit activeVisit = gymVisitRepository
                .findByUserIdAndStatus(userId, GymVisitStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active session found. Please check in first."));

        // Update visit
        activeVisit.setCheckOutTime(LocalDateTime.now());
        activeVisit.setStatus(GymVisitStatus.COMPLETED);

        GymVisit updatedVisit = gymVisitRepository.save(activeVisit);
        
        // Get gym name for response
        Gym gym = gymRepository.findById(activeVisit.getGymId()).orElse(null);
        
        return mapToResponse(updatedVisit, gym);
    }

    private GymVisitResponse mapToResponse(GymVisit visit, Gym gym) {
        GymVisitResponse response = new GymVisitResponse();
        response.setId(visit.getId());
        response.setGymName(gym != null ? gym.getGymName() : "Unknown Gym");
        response.setCheckInTime(visit.getCheckInTime());
        response.setCheckOutTime(visit.getCheckOutTime());
        response.setVisitDate(visit.getVisitDate());
        response.setStatus(visit.getStatus());
        return response;
    }
}