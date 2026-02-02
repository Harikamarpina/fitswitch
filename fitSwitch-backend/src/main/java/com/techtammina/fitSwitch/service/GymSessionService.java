package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.GymSessionResponse;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class GymSessionService {

    private final GymSessionRepository gymSessionRepository;
    private final MembershipRepository membershipRepository;
    private final UserFacilitySubscriptionRepository facilitySubscriptionRepository;
    private final GymRepository gymRepository;

    public GymSessionService(GymSessionRepository gymSessionRepository,
                           MembershipRepository membershipRepository,
                           UserFacilitySubscriptionRepository facilitySubscriptionRepository,
                           GymRepository gymRepository) {
        this.gymSessionRepository = gymSessionRepository;
        this.membershipRepository = membershipRepository;
        this.facilitySubscriptionRepository = facilitySubscriptionRepository;
        this.gymRepository = gymRepository;
    }

    public GymSessionResponse checkIn(Long userId, Long gymId) {
        if (gymId == null) {
            throw new RuntimeException("Gym ID is required");
        }
        
        LocalDate today = LocalDate.now();
        
        // Check if user already has an active session today for this gym
        Optional<GymSession> existingSession = gymSessionRepository
            .findByUserIdAndGymIdAndVisitDateAndStatus(userId, gymId, today, GymSession.SessionStatus.ACTIVE);
        
        if (existingSession.isPresent()) {
            throw new RuntimeException("You already have an active session for this gym today");
        }

        // Validate user has active membership or facility subscription
        Long membershipId = null;
        Long facilitySubscriptionId = null;
        
        // Check for active membership
        Optional<Membership> activeMembership = membershipRepository
            .findByUserIdAndGymIdAndStatus(userId, gymId, MembershipStatus.ACTIVE);
        
        if (activeMembership.isPresent()) {
            membershipId = activeMembership.get().getId();
        } else {
            // Check for active facility subscription
            Optional<UserFacilitySubscription> activeFacilitySubscription = facilitySubscriptionRepository
                .findByUserIdAndGymIdAndStatus(userId, gymId, FacilitySubscriptionStatus.ACTIVE);
            
            if (activeFacilitySubscription.isPresent()) {
                facilitySubscriptionId = activeFacilitySubscription.get().getId();
            } else {
                throw new RuntimeException("No active membership or facility subscription found for this gym");
            }
        }

        // Create new session
        GymSession session = new GymSession();
        session.setUserId(userId);
        session.setGymId(gymId);
        session.setMembershipId(membershipId);
        session.setFacilitySubscriptionId(facilitySubscriptionId);
        session.setCheckInTime(LocalDateTime.now());
        session.setVisitDate(today);
        session.setStatus(GymSession.SessionStatus.ACTIVE);

        GymSession savedSession = gymSessionRepository.save(session);
        
        return mapToResponse(savedSession, "Check-in successful");
    }

    public GymSessionResponse checkOut(Long userId) {
        // Find active session for user
        Optional<GymSession> activeSession = gymSessionRepository
            .findByUserIdAndStatus(userId, GymSession.SessionStatus.ACTIVE);
        
        if (activeSession.isEmpty()) {
            throw new RuntimeException("No active session found. Please check-in first");
        }

        GymSession session = activeSession.get();
        session.setCheckOutTime(LocalDateTime.now());
        session.setStatus(GymSession.SessionStatus.COMPLETED);

        GymSession updatedSession = gymSessionRepository.save(session);
        
        return mapToResponse(updatedSession, "Check-out successful");
    }

    private GymSessionResponse mapToResponse(GymSession session, String message) {
        GymSessionResponse response = new GymSessionResponse();
        response.setSessionId(session.getId());
        response.setGymId(session.getGymId());
        response.setCheckInTime(session.getCheckInTime());
        response.setCheckOutTime(session.getCheckOutTime());
        response.setStatus(session.getStatus().toString());
        response.setMessage(message);
        
        // Get gym name
        gymRepository.findById(session.getGymId())
            .ifPresent(gym -> response.setGymName(gym.getGymName()));
        
        return response;
    }
}