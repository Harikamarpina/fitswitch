package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.ActiveFacilitySessionResponse;
import com.techtammina.fitSwitch.dto.FacilitySessionResponse;
import com.techtammina.fitSwitch.entity.FacilitySession;
import com.techtammina.fitSwitch.entity.FacilitySubscriptionStatus;
import com.techtammina.fitSwitch.entity.UserFacilitySubscription;
import com.techtammina.fitSwitch.repository.FacilityPlanRepository;
import com.techtammina.fitSwitch.repository.GymFacilityRepository;
import com.techtammina.fitSwitch.repository.GymRepository;
import com.techtammina.fitSwitch.repository.FacilitySessionRepository;
import com.techtammina.fitSwitch.repository.UserFacilitySubscriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FacilitySessionService {

    private final FacilitySessionRepository sessionRepository;
    private final UserFacilitySubscriptionRepository subscriptionRepository;
    private final GymRepository gymRepository;
    private final GymFacilityRepository gymFacilityRepository;
    private final FacilityPlanRepository facilityPlanRepository;

    public FacilitySessionService(FacilitySessionRepository sessionRepository,
                                  UserFacilitySubscriptionRepository subscriptionRepository,
                                  GymRepository gymRepository,
                                  GymFacilityRepository gymFacilityRepository,
                                  FacilityPlanRepository facilityPlanRepository) {
        this.sessionRepository = sessionRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.gymRepository = gymRepository;
        this.gymFacilityRepository = gymFacilityRepository;
        this.facilityPlanRepository = facilityPlanRepository;
    }

    public FacilitySessionResponse checkIn(Long userId, Long facilitySubscriptionId) {
        UserFacilitySubscription subscription = subscriptionRepository.findById(facilitySubscriptionId)
                .orElseThrow(() -> new RuntimeException("Facility subscription not found"));

        if (!subscription.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to facility subscription");
        }

        if (subscription.getStatus() != FacilitySubscriptionStatus.ACTIVE) {
            throw new RuntimeException("Facility subscription is not active");
        }

        LocalDate today = LocalDate.now();
        if (subscription.getEndDate().isBefore(today)) {
            subscription.setStatus(FacilitySubscriptionStatus.EXPIRED);
            subscriptionRepository.save(subscription);
            throw new RuntimeException("Facility subscription has expired");
        }
        Optional<FacilitySession> existing = sessionRepository
                .findFirstByFacilitySubscriptionIdAndVisitDateOrderByCheckInTimeDesc(
                        facilitySubscriptionId, today);
        if (existing.isPresent()) {
            throw new RuntimeException("Already accessed this facility today");
        }

        FacilitySession session = new FacilitySession();
        session.setUserId(userId);
        session.setGymId(subscription.getGymId());
        session.setFacilityId(subscription.getFacilityId());
        session.setFacilityPlanId(subscription.getFacilityPlanId());
        session.setFacilitySubscriptionId(subscription.getId());
        session.setCheckInTime(LocalDateTime.now());
        session.setVisitDate(today);
        session.setStatus(FacilitySession.SessionStatus.ACTIVE);

        FacilitySession saved = sessionRepository.save(session);
        return mapToResponse(saved, "Check-in successful");
    }

    public FacilitySessionResponse checkOut(Long userId, Long facilitySubscriptionId) {
        FacilitySession session = sessionRepository
                .findByUserIdAndFacilitySubscriptionIdAndStatus(
                        userId, facilitySubscriptionId, FacilitySession.SessionStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active session found for this facility subscription"));

        session.setCheckOutTime(LocalDateTime.now());
        session.setStatus(FacilitySession.SessionStatus.COMPLETED);
        FacilitySession updated = sessionRepository.save(session);
        return mapToResponse(updated, "Check-out successful");
    }

    public FacilitySessionResponse getCurrent(Long userId, Long facilitySubscriptionId) {
        Optional<FacilitySession> session = sessionRepository
                .findByUserIdAndFacilitySubscriptionIdAndStatus(
                        userId, facilitySubscriptionId, FacilitySession.SessionStatus.ACTIVE);
        if (session.isEmpty()) {
            FacilitySessionResponse response = new FacilitySessionResponse();
            response.setFacilitySubscriptionId(facilitySubscriptionId);
            response.setStatus("NONE");
            return response;
        }
        return mapToResponse(session.get(), "Active session");
    }

    public boolean hasAccessedToday(Long userId, Long facilitySubscriptionId) {
        UserFacilitySubscription subscription = subscriptionRepository.findById(facilitySubscriptionId)
                .orElseThrow(() -> new RuntimeException("Facility subscription not found"));
        if (!subscription.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to facility subscription");
        }
        LocalDate today = LocalDate.now();
        return sessionRepository
                .findFirstByFacilitySubscriptionIdAndVisitDateOrderByCheckInTimeDesc(facilitySubscriptionId, today)
                .isPresent();
    }

    public List<ActiveFacilitySessionResponse> getActiveSessions(Long userId) {
        return sessionRepository.findByUserIdAndStatus(userId, FacilitySession.SessionStatus.ACTIVE)
                .stream()
                .map(this::mapToActiveResponse)
                .toList();
    }

    private FacilitySessionResponse mapToResponse(FacilitySession session, String message) {
        FacilitySessionResponse response = new FacilitySessionResponse();
        response.setSessionId(session.getId());
        response.setFacilitySubscriptionId(session.getFacilitySubscriptionId());
        response.setFacilityId(session.getFacilityId());
        response.setGymId(session.getGymId());
        response.setStatus(session.getStatus().toString());
        response.setCheckInTime(session.getCheckInTime());
        response.setCheckOutTime(session.getCheckOutTime());
        response.setMessage(message);
        return response;
    }

    private ActiveFacilitySessionResponse mapToActiveResponse(FacilitySession session) {
        ActiveFacilitySessionResponse response = new ActiveFacilitySessionResponse();
        response.setSessionId(session.getId());
        response.setFacilitySubscriptionId(session.getFacilitySubscriptionId());
        response.setFacilityId(session.getFacilityId());
        response.setGymId(session.getGymId());
        response.setCheckInTime(session.getCheckInTime());

        gymRepository.findById(session.getGymId())
                .ifPresent(gym -> response.setGymName(gym.getGymName()));
        gymFacilityRepository.findById(session.getFacilityId())
                .ifPresent(facility -> response.setFacilityName(facility.getFacilityName()));
        facilityPlanRepository.findById(session.getFacilityPlanId())
                .ifPresent(plan -> response.setPlanName(plan.getPlanName()));

        return response;
    }
}
