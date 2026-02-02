package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.FacilitySubscribeRequest;
import com.techtammina.fitSwitch.dto.UserFacilitySubscriptionResponse;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserFacilitySubscriptionService {

    private final UserFacilitySubscriptionRepository subscriptionRepository;
    private final FacilityPlanRepository facilityPlanRepository;
    private final GymFacilityRepository gymFacilityRepository;
    private final GymRepository gymRepository;

    public UserFacilitySubscriptionService(UserFacilitySubscriptionRepository subscriptionRepository,
                                          FacilityPlanRepository facilityPlanRepository,
                                          GymFacilityRepository gymFacilityRepository,
                                          GymRepository gymRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.facilityPlanRepository = facilityPlanRepository;
        this.gymFacilityRepository = gymFacilityRepository;
        this.gymRepository = gymRepository;
    }

    public UserFacilitySubscriptionResponse subscribeFacility(Long userId, FacilitySubscribeRequest request) {
        // Validate facility plan exists and is active
        FacilityPlan plan = facilityPlanRepository.findById(request.getFacilityPlanId())
                .orElseThrow(() -> new RuntimeException("Facility plan not found"));

        if (!plan.isActive()) {
            throw new RuntimeException("Facility plan is not active");
        }

        // Check if user already has active subscription for this facility
        subscriptionRepository.findByUserIdAndFacilityIdAndStatus(
                userId, plan.getFacilityId(), FacilitySubscriptionStatus.ACTIVE)
                .ifPresent(existing -> {
                    throw new RuntimeException("Active facility subscription already exists");
                });

        // Create subscription
        UserFacilitySubscription subscription = new UserFacilitySubscription();
        subscription.setUserId(userId);
        subscription.setGymId(plan.getGymId());
        subscription.setFacilityId(plan.getFacilityId());
        subscription.setFacilityPlanId(plan.getId());
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
        subscription.setStatus(FacilitySubscriptionStatus.ACTIVE);
        subscription.setCreatedAt(LocalDateTime.now());

        UserFacilitySubscription saved = subscriptionRepository.save(subscription);

        // Get related entities for response
        Gym gym = gymRepository.findById(plan.getGymId()).orElse(null);
        GymFacility facility = gymFacilityRepository.findById(plan.getFacilityId()).orElse(null);

        return mapToResponse(saved, gym, facility, plan);
    }

    public List<UserFacilitySubscriptionResponse> getUserFacilitySubscriptions(Long userId) {
        List<UserFacilitySubscription> subscriptions = subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);

        // Auto-expire subscriptions
        LocalDate today = LocalDate.now();
        subscriptions.forEach(subscription -> {
            if (subscription.getStatus() == FacilitySubscriptionStatus.ACTIVE &&
                subscription.getEndDate().isBefore(today)) {
                subscription.setStatus(FacilitySubscriptionStatus.EXPIRED);
                subscriptionRepository.save(subscription);
            }
        });

        return subscriptions.stream()
                .map(subscription -> {
                    FacilityPlan plan = facilityPlanRepository.findById(subscription.getFacilityPlanId()).orElse(null);
                    Gym gym = gymRepository.findById(subscription.getGymId()).orElse(null);
                    GymFacility facility = gymFacilityRepository.findById(subscription.getFacilityId()).orElse(null);
                    return mapToResponse(subscription, gym, facility, plan);
                })
                .toList();
    }

    private UserFacilitySubscriptionResponse mapToResponse(UserFacilitySubscription subscription, 
                                                          Gym gym, GymFacility facility, FacilityPlan plan) {
        UserFacilitySubscriptionResponse response = new UserFacilitySubscriptionResponse();
        response.setId(subscription.getId());
        response.setGymName(gym != null ? gym.getGymName() : "Unknown Gym");
        response.setFacilityName(facility != null ? facility.getFacilityName() : "Unknown Facility");
        response.setPlanName(plan != null ? plan.getPlanName() : "Unknown Plan");
        response.setStartDate(subscription.getStartDate());
        response.setEndDate(subscription.getEndDate());
        response.setStatus(subscription.getStatus());
        response.setPrice(plan != null ? plan.getPrice() : null);
        response.setDurationDays(plan != null ? plan.getDurationDays() : null);
        return response;
    }
}