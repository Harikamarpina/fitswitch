package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.UserDashboardStatsResponse;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserDashboardStatsService {

    private final GymSessionRepository gymSessionRepository;
    private final MembershipRepository membershipRepository;
    private final UserFacilitySubscriptionRepository facilitySubscriptionRepository;
    private final GymRepository gymRepository;
    private final GymFacilityRepository gymFacilityRepository;
    private final FacilityPlanRepository facilityPlanRepository;
    private final GymPlanRepository gymPlanRepository;
    private final UserWalletRepository walletRepository;

    public UserDashboardStatsService(GymSessionRepository gymSessionRepository,
                                   MembershipRepository membershipRepository,
                                   UserFacilitySubscriptionRepository facilitySubscriptionRepository,
                                   GymRepository gymRepository,
                                   GymFacilityRepository gymFacilityRepository,
                                   FacilityPlanRepository facilityPlanRepository,
                                   GymPlanRepository gymPlanRepository,
                                   UserWalletRepository walletRepository) {
        this.gymSessionRepository = gymSessionRepository;
        this.membershipRepository = membershipRepository;
        this.facilitySubscriptionRepository = facilitySubscriptionRepository;
        this.gymRepository = gymRepository;
        this.gymFacilityRepository = gymFacilityRepository;
        this.facilityPlanRepository = facilityPlanRepository;
        this.gymPlanRepository = gymPlanRepository;
        this.walletRepository = walletRepository;
    }

    public UserDashboardStatsResponse getUserDashboardStats(Long userId) {
        UserDashboardStatsResponse response = new UserDashboardStatsResponse();

        // Total visit days
        int totalVisitDays = gymSessionRepository.countCompletedVisitDaysByUserId(userId);
        response.setTotalVisitDays(totalVisitDays);

        // Last visit date
        Optional<LocalDate> lastVisitDate = gymSessionRepository.findLastVisitDateByUserId(userId);
        response.setLastVisitDate(lastVisitDate.orElse(null));

        // Wallet balance
        BigDecimal walletBalance = walletRepository.findByUserId(userId)
                .map(UserWallet::getBalance)
                .orElse(BigDecimal.ZERO);
        response.setWalletBalance(walletBalance);

        // Active memberships
        List<Membership> activeMemberships = membershipRepository.findByUserIdAndStatus(userId, MembershipStatus.ACTIVE);
        List<UserDashboardStatsResponse.ActiveMembershipDto> activeMembershipDtos = new ArrayList<>();
        for (Membership membership : activeMemberships) {
            UserDashboardStatsResponse.ActiveMembershipDto dto = new UserDashboardStatsResponse.ActiveMembershipDto();
            gymRepository.findById(membership.getGymId()).ifPresent(gym -> dto.setGymName(gym.getGymName()));
            gymPlanRepository.findById(membership.getPlanId()).ifPresent(plan -> dto.setPlanName(plan.getPlanName()));
            dto.setEndDate(membership.getEndDate());
            activeMembershipDtos.add(dto);
        }
        response.setActiveMemberships(activeMembershipDtos);

        // Active facility subscriptions
        List<UserFacilitySubscription> activeFacilitySubscriptions = facilitySubscriptionRepository
            .findByUserIdAndStatus(userId, FacilitySubscriptionStatus.ACTIVE);
        List<UserDashboardStatsResponse.ActiveFacilitySubscriptionDto> activeFacilityDtos = new ArrayList<>();
        for (UserFacilitySubscription subscription : activeFacilitySubscriptions) {
            UserDashboardStatsResponse.ActiveFacilitySubscriptionDto dto = new UserDashboardStatsResponse.ActiveFacilitySubscriptionDto();
            gymRepository.findById(subscription.getGymId()).ifPresent(gym -> dto.setGymName(gym.getGymName()));
            gymFacilityRepository.findById(subscription.getFacilityId()).ifPresent(facility -> dto.setFacilityName(facility.getFacilityName()));
            facilityPlanRepository.findById(subscription.getFacilityPlanId()).ifPresent(plan -> dto.setPlanName(plan.getPlanName()));
            dto.setEndDate(subscription.getEndDate());
            activeFacilityDtos.add(dto);
        }
        response.setActiveFacilitySubscriptions(activeFacilityDtos);

        // Subscription expiry dates
        List<UserDashboardStatsResponse.SubscriptionExpiryDto> expiryDates = new ArrayList<>();
        for (UserDashboardStatsResponse.ActiveMembershipDto membership : activeMembershipDtos) {
            UserDashboardStatsResponse.SubscriptionExpiryDto expiry = new UserDashboardStatsResponse.SubscriptionExpiryDto();
            expiry.setType("Membership");
            expiry.setName(membership.getGymName() + " - " + membership.getPlanName());
            expiry.setExpiryDate(membership.getEndDate());
            expiryDates.add(expiry);
        }
        for (UserDashboardStatsResponse.ActiveFacilitySubscriptionDto subscription : activeFacilityDtos) {
            UserDashboardStatsResponse.SubscriptionExpiryDto expiry = new UserDashboardStatsResponse.SubscriptionExpiryDto();
            expiry.setType("Facility");
            expiry.setName(subscription.getFacilityName() + " - " + subscription.getPlanName());
            expiry.setExpiryDate(subscription.getEndDate());
            expiryDates.add(expiry);
        }
        response.setSubscriptionExpiryDates(expiryDates);

        // Current session status
        Optional<GymSession> activeSession = gymSessionRepository.findByUserIdAndStatus(userId, GymSession.SessionStatus.ACTIVE);
        response.setCurrentSessionStatus(activeSession.isPresent() ? "ACTIVE" : "NONE");

        return response;
    }
}