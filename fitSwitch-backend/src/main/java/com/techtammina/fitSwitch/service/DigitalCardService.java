package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.DigitalCardResponse;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DigitalCardService {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final UserFacilitySubscriptionRepository subscriptionRepository;
    private final GymRepository gymRepository;
    private final GymFacilityRepository facilityRepository;
    private final GymPlanRepository planRepository;
    private final FacilityPlanRepository facilityPlanRepository;
    private final UserWalletRepository walletRepository;

    public DigitalCardService(UserRepository userRepository,
                             MembershipRepository membershipRepository,
                             UserFacilitySubscriptionRepository subscriptionRepository,
                             GymRepository gymRepository,
                             GymFacilityRepository facilityRepository,
                             GymPlanRepository planRepository,
                             FacilityPlanRepository facilityPlanRepository,
                             UserWalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.gymRepository = gymRepository;
        this.facilityRepository = facilityRepository;
        this.planRepository = planRepository;
        this.facilityPlanRepository = facilityPlanRepository;
        this.walletRepository = walletRepository;
    }

    public DigitalCardResponse getDigitalCardData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DigitalCardResponse response = new DigitalCardResponse();
        response.setUserName(user.getFullName());
        response.setUserEmail(user.getEmail());

        // Get wallet balance
        UserWallet wallet = walletRepository.findByUserId(userId).orElse(null);
        response.setWalletBalance(wallet != null ? wallet.getBalance() : null);

        // Get active memberships
        List<Membership> activeMemberships = membershipRepository
                .findByUserIdAndStatus(userId, MembershipStatus.ACTIVE);
        
        List<DigitalCardResponse.ActiveMembershipDto> membershipDtos = activeMemberships.stream()
                .filter(m -> m.getEndDate().isAfter(LocalDate.now()))
                .map(this::mapToMembershipDto)
                .collect(Collectors.toList());
        response.setActiveMemberships(membershipDtos);

        // Get active facility subscriptions
        List<UserFacilitySubscription> activeSubscriptions = subscriptionRepository
                .findByUserIdAndStatus(userId, FacilitySubscriptionStatus.ACTIVE);
        
        List<DigitalCardResponse.ActiveSubscriptionDto> subscriptionDtos = activeSubscriptions.stream()
                .filter(s -> s.getEndDate().isAfter(LocalDate.now()))
                .map(this::mapToSubscriptionDto)
                .collect(Collectors.toList());
        response.setActiveSubscriptions(subscriptionDtos);

        return response;
    }

    private DigitalCardResponse.ActiveMembershipDto mapToMembershipDto(Membership membership) {
        DigitalCardResponse.ActiveMembershipDto dto = new DigitalCardResponse.ActiveMembershipDto();
        dto.setMembershipId(membership.getId());
        dto.setGymId(membership.getGymId());
        dto.setStartDate(membership.getStartDate());
        dto.setEndDate(membership.getEndDate());
        dto.setStatus(membership.getStatus().toString());

        // Get gym and plan details
        Gym gym = gymRepository.findById(membership.getGymId()).orElse(null);
        dto.setGymName(gym != null ? gym.getGymName() : "Unknown Gym");

        GymPlan plan = planRepository.findById(membership.getPlanId()).orElse(null);
        dto.setPlanName(plan != null ? plan.getPlanName() : "Unknown Plan");

        return dto;
    }

    private DigitalCardResponse.ActiveSubscriptionDto mapToSubscriptionDto(UserFacilitySubscription subscription) {
        DigitalCardResponse.ActiveSubscriptionDto dto = new DigitalCardResponse.ActiveSubscriptionDto();
        dto.setSubscriptionId(subscription.getId());
        dto.setGymId(subscription.getGymId());
        dto.setFacilityId(subscription.getFacilityId());
        dto.setStartDate(subscription.getStartDate());
        dto.setEndDate(subscription.getEndDate());
        dto.setStatus(subscription.getStatus().toString());

        // Get gym, facility and plan details
        Gym gym = gymRepository.findById(subscription.getGymId()).orElse(null);
        dto.setGymName(gym != null ? gym.getGymName() : "Unknown Gym");

        GymFacility facility = facilityRepository.findById(subscription.getFacilityId()).orElse(null);
        dto.setFacilityName(facility != null ? facility.getFacilityName() : "Unknown Facility");

        FacilityPlan plan = facilityPlanRepository.findById(subscription.getFacilityPlanId()).orElse(null);
        dto.setPlanName(plan != null ? plan.getPlanName() : "Unknown Plan");

        return dto;
    }
}