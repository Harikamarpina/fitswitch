package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.*;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OwnerStatsService {

    private final GymMembershipSessionRepository gymSessionRepository;
    private final MembershipRepository membershipRepository;
    private final UserFacilitySubscriptionRepository facilitySubscriptionRepository;
    private final GymRepository gymRepository;
    private final UserRepository userRepository;
    private final GymFacilityRepository gymFacilityRepository;
    private final FacilityPlanRepository facilityPlanRepository;
    private final GymPlanRepository gymPlanRepository;

    public OwnerStatsService(GymMembershipSessionRepository gymSessionRepository,
                           MembershipRepository membershipRepository,
                           UserFacilitySubscriptionRepository facilitySubscriptionRepository,
                           GymRepository gymRepository,
                           UserRepository userRepository,
                           GymFacilityRepository gymFacilityRepository,
                           FacilityPlanRepository facilityPlanRepository,
                           GymPlanRepository gymPlanRepository) {
        this.gymSessionRepository = gymSessionRepository;
        this.membershipRepository = membershipRepository;
        this.facilitySubscriptionRepository = facilitySubscriptionRepository;
        this.gymRepository = gymRepository;
        this.userRepository = userRepository;
        this.gymFacilityRepository = gymFacilityRepository;
        this.facilityPlanRepository = facilityPlanRepository;
        this.gymPlanRepository = gymPlanRepository;
    }

    public List<GymUserResponse> getGymUsers(Long ownerId, Long gymId) {
        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        List<Long> userIds = gymSessionRepository.findDistinctUserIdsByGymId(gymId);
        List<GymUserResponse> gymUsers = new ArrayList<>();

        for (Long userId : userIds) {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                GymUserResponse response = new GymUserResponse();
                response.setUserId(userId);
                response.setUserName(user.getFullName());
                response.setEmail(user.getEmail());

                // Check membership status
                Optional<Membership> activeMembership = membershipRepository
                    .findByUserIdAndGymIdAndStatus(userId, gymId, MembershipStatus.ACTIVE);
                response.setMembershipStatus(activeMembership.isPresent() ? "ACTIVE" : "NONE");

                // Check facility subscription status
                Optional<UserFacilitySubscription> activeFacilitySubscription = facilitySubscriptionRepository
                    .findByUserIdAndGymIdAndStatus(userId, gymId, FacilitySubscriptionStatus.ACTIVE);
                response.setFacilitySubscriptionStatus(activeFacilitySubscription.isPresent() ? "ACTIVE" : "NONE");

                // Get visit stats
                int totalVisits = gymSessionRepository.countCompletedSessionsByUserAndGym(userId, gymId);
                response.setTotalVisits(totalVisits);

                Optional<LocalDate> lastVisitDate = gymSessionRepository.findLastVisitDateByUserId(userId);
                response.setLastVisitDate(lastVisitDate.orElse(null));

                gymUsers.add(response);
            }
        }

        return gymUsers;
    }

    public OwnerUserStatsResponse getUserStats(Long ownerId, Long gymId, Long userId) {
        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        OwnerUserStatsResponse response = new OwnerUserStatsResponse();
        response.setUserId(userId);
        response.setUserName(user.getFullName());
        response.setEmail(user.getEmail());

        // Get memberships for this gym
        List<Membership> memberships = membershipRepository.findByUserIdAndGymId(userId, gymId);
        List<OwnerUserStatsResponse.UserMembershipDto> membershipDtos = new ArrayList<>();
        for (Membership membership : memberships) {
            OwnerUserStatsResponse.UserMembershipDto dto = new OwnerUserStatsResponse.UserMembershipDto();
            gymPlanRepository.findById(membership.getPlanId()).ifPresent(plan -> dto.setPlanName(plan.getPlanName()));
            dto.setPurchaseDate(membership.getStartDate());
            dto.setExpiryDate(membership.getEndDate());
            dto.setStatus(membership.getStatus().toString());
            membershipDtos.add(dto);
        }
        response.setMemberships(membershipDtos);

        // Get facility subscriptions for this gym
        List<UserFacilitySubscription> facilitySubscriptions = facilitySubscriptionRepository.findByUserIdAndGymId(userId, gymId);
        List<OwnerUserStatsResponse.UserFacilitySubscriptionDto> facilityDtos = new ArrayList<>();
        for (UserFacilitySubscription subscription : facilitySubscriptions) {
            OwnerUserStatsResponse.UserFacilitySubscriptionDto dto = new OwnerUserStatsResponse.UserFacilitySubscriptionDto();
            gymFacilityRepository.findById(subscription.getFacilityId()).ifPresent(facility -> dto.setFacilityName(facility.getFacilityName()));
            facilityPlanRepository.findById(subscription.getFacilityPlanId()).ifPresent(plan -> dto.setPlanName(plan.getPlanName()));
            dto.setPurchaseDate(subscription.getStartDate());
            dto.setExpiryDate(subscription.getEndDate());
            dto.setStatus(subscription.getStatus().toString());
            facilityDtos.add(dto);
        }
        response.setFacilitySubscriptions(facilityDtos);

        // Get visit stats
        int totalVisits = gymSessionRepository.countCompletedSessionsByUserAndGym(userId, gymId);
        response.setTotalVisitCount(totalVisits);

        // Get latest session info
        List<GymMembershipSession> latestSessions = gymSessionRepository.findLatestSessionsByUserAndGym(userId, gymId);
        if (!latestSessions.isEmpty()) {
            GymMembershipSession latestSession = latestSessions.get(0);
            response.setLastCheckIn(latestSession.getCheckInTime());
            response.setLastCheckOut(latestSession.getCheckOutTime());
        }

        return response;
    }

    public List<PlanUserResponse> getGymPlanUsers(Long ownerId, Long gymId, Long planId) {
        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        List<Membership> memberships = membershipRepository.findByGymIdAndPlanId(gymId, planId);
        List<PlanUserResponse> planUsers = new ArrayList<>();

        for (Membership membership : memberships) {
            Optional<User> userOpt = userRepository.findById(membership.getUserId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                PlanUserResponse response = new PlanUserResponse();
                response.setUserId(user.getId());
                response.setUserName(user.getFullName());
                response.setEmail(user.getEmail());
                response.setPurchaseDate(membership.getStartDate());
                response.setExpiryDate(membership.getEndDate());
                response.setStatus(membership.getStatus().toString());
                response.setPlanType("MEMBERSHIP");

                // Get visit stats
                int totalVisits = gymSessionRepository.countCompletedSessionsByUserAndGym(user.getId(), gymId);
                response.setTotalVisits(totalVisits);

                Optional<LocalDate> lastVisitDate = gymSessionRepository.findLastVisitDateByUserId(user.getId());
                response.setLastVisitDate(lastVisitDate.orElse(null));

                // Get latest session info
                List<GymMembershipSession> latestSessions = gymSessionRepository.findLatestSessionsByUserAndGym(user.getId(), gymId);
                if (!latestSessions.isEmpty()) {
                    response.setLastCheckIn(latestSessions.get(0).getCheckInTime());
                }

                planUsers.add(response);
            }
        }

        return planUsers;
    }

    public List<PlanUserResponse> getFacilityPlanUsers(Long ownerId, Long facilityId, Long planId) {
        // Verify facility belongs to owner's gym
        GymFacility facility = gymFacilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found"));
        
        Gym gym = gymRepository.findById(facility.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        List<UserFacilitySubscription> subscriptions = facilitySubscriptionRepository.findByFacilityIdAndFacilityPlanId(facilityId, planId);
        List<PlanUserResponse> planUsers = new ArrayList<>();

        for (UserFacilitySubscription subscription : subscriptions) {
            Optional<User> userOpt = userRepository.findById(subscription.getUserId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                PlanUserResponse response = new PlanUserResponse();
                response.setUserId(user.getId());
                response.setUserName(user.getFullName());
                response.setEmail(user.getEmail());
                response.setPurchaseDate(subscription.getStartDate());
                response.setExpiryDate(subscription.getEndDate());
                response.setStatus(subscription.getStatus().toString());
                response.setPlanType("FACILITY");

                // Get visit stats for the gym
                int totalVisits = gymSessionRepository.countCompletedSessionsByUserAndGym(user.getId(), facility.getGymId());
                response.setTotalVisits(totalVisits);

                Optional<LocalDate> lastVisitDate = gymSessionRepository.findLastVisitDateByUserId(user.getId());
                response.setLastVisitDate(lastVisitDate.orElse(null));

                // Get latest session info
                List<GymMembershipSession> latestSessions = gymSessionRepository.findLatestSessionsByUserAndGym(user.getId(), facility.getGymId());
                if (!latestSessions.isEmpty()) {
                    response.setLastCheckIn(latestSessions.get(0).getCheckInTime());
                }

                planUsers.add(response);
            }
        }

        return planUsers;
    }

    // New methods for owner visibility
    public List<OwnerTodayVisitResponse> getTodayVisits(Long ownerId, Long gymId) {
        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        LocalDate today = LocalDate.now();
        return gymSessionRepository.findTodayVisitsByGymId(gymId, today);
    }

    public List<OwnerGymMemberResponse> getGymMembers(Long ownerId, Long gymId) {
        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        // Update expired memberships and subscriptions
        updateExpiredPlans(gymId);
        
        List<OwnerGymMemberResponse> allMembers = new ArrayList<>();
        
        // Get active gym members
        List<OwnerGymMemberResponse> gymMembers = membershipRepository.findActiveGymMembers(gymId);
        allMembers.addAll(gymMembers);
        
        // Get active facility subscribers (who might not have gym memberships)
        List<OwnerGymMemberResponse> facilitySubscribers = facilitySubscriptionRepository.findActiveFacilitySubscribers(gymId);
        
        // Add facility subscribers who don't already have gym memberships
        for (OwnerGymMemberResponse facilitySubscriber : facilitySubscribers) {
            boolean hasGymMembership = gymMembers.stream()
                    .anyMatch(gymMember -> gymMember.getUserId().equals(facilitySubscriber.getUserId()));
            
            if (!hasGymMembership) {
                allMembers.add(facilitySubscriber);
            }
        }
        
        return allMembers;
    }

    public List<OwnerGymMemberResponse> getExpiringSoon(Long ownerId, Long gymId) {
        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysFromNow = today.plusDays(7);
        
        List<OwnerGymMemberResponse> expiringMembers = new ArrayList<>();
        
        // Get expiring gym memberships
        List<OwnerGymMemberResponse> expiringGymMembers = membershipRepository.findExpiringSoonMembers(gymId, today, sevenDaysFromNow);
        expiringMembers.addAll(expiringGymMembers);
        
        // Get expiring facility subscriptions
        List<UserFacilitySubscription> expiringSubscriptions = facilitySubscriptionRepository
                .findByGymIdAndStatusAndEndDateBetween(gymId, FacilitySubscriptionStatus.ACTIVE, today, sevenDaysFromNow);
        
        for (UserFacilitySubscription subscription : expiringSubscriptions) {
            Optional<User> userOpt = userRepository.findById(subscription.getUserId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Check if user already has an expiring gym membership to avoid duplicates
                boolean hasExpiringGymMembership = expiringGymMembers.stream()
                        .anyMatch(member -> member.getUserId().equals(user.getId()));
                
                if (!hasExpiringGymMembership) {
                    OwnerGymMemberResponse response = new OwnerGymMemberResponse();
                    response.setUserId(user.getId());
                    response.setUserName(user.getFullName());
                    response.setEmail(user.getEmail());
                    response.setStartDate(subscription.getStartDate());
                    response.setEndDate(subscription.getEndDate());
                    response.setStatus(subscription.getStatus().toString());
                    response.setPlanType("FACILITY");
                    
                    // Get plan name
                    facilityPlanRepository.findById(subscription.getFacilityPlanId())
                            .ifPresent(plan -> response.setPlanName(plan.getPlanName()));
                    
                    // Get last visit date
                    Optional<LocalDate> lastVisitDate = gymSessionRepository.findLastVisitDateByUserId(user.getId());
                    response.setLastVisitDate(lastVisitDate.orElse(null));
                    
                    expiringMembers.add(response);
                }
            }
        }
        
        return expiringMembers;
    }

    private void updateExpiredPlans(Long gymId) {
        LocalDate today = LocalDate.now();
        
        // Update expired memberships
        List<Long> expiredMembershipIds = membershipRepository.findExpiredMembershipIdsByGym(gymId, today);
        if (!expiredMembershipIds.isEmpty()) {
            membershipRepository.updateMembershipsToExpired(expiredMembershipIds, MembershipStatus.EXPIRED);
        }
        
        // Update expired facility subscriptions
        List<Long> expiredSubscriptionIds = facilitySubscriptionRepository.findExpiredSubscriptionIdsByGym(gymId, today);
        if (!expiredSubscriptionIds.isEmpty()) {
            facilitySubscriptionRepository.updateSubscriptionsToExpired(expiredSubscriptionIds, FacilitySubscriptionStatus.EXPIRED);
        }
    }
}
