package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.MembershipCreateRequest;
import com.techtammina.fitSwitch.dto.MembershipResponse;
import com.techtammina.fitSwitch.dto.UserMembershipResponse;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.GymPlanRepository;
import com.techtammina.fitSwitch.repository.GymRepository;
import com.techtammina.fitSwitch.repository.MembershipRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final GymRepository gymRepository;
    private final GymPlanRepository planRepository;

    public MembershipService(MembershipRepository membershipRepository, 
                           GymRepository gymRepository, 
                           GymPlanRepository planRepository) {
        this.membershipRepository = membershipRepository;
        this.gymRepository = gymRepository;
        this.planRepository = planRepository;
    }

    public MembershipResponse createMembership(Long userId, MembershipCreateRequest request) {
        // Validate gym exists and is active
        Gym gym = gymRepository.findById(request.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.isActive()) {
            throw new RuntimeException("Gym is not active");
        }

        // Validate plan exists and is active
        GymPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        
        if (!plan.isActive()) {
            throw new RuntimeException("Plan is not active");
        }

        // Validate plan belongs to the gym
        if (!plan.getGymId().equals(request.getGymId())) {
            throw new RuntimeException("Plan does not belong to the selected gym");
        }

        // Check if user already has active membership for this gym
        membershipRepository.findByUserIdAndGymIdAndStatus(userId, request.getGymId(), MembershipStatus.ACTIVE)
                .ifPresent(existing -> {
                    throw new RuntimeException("Active membership already exists for this gym");
                });

        // Create membership
        Membership membership = new Membership();
        membership.setUserId(userId);
        membership.setGymId(request.getGymId());
        membership.setPlanId(request.getPlanId());
        membership.setStartDate(LocalDate.now());
        membership.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
        membership.setStatus(MembershipStatus.ACTIVE);
        membership.setCreatedAt(LocalDateTime.now());

        Membership saved = membershipRepository.save(membership);
        return mapToResponse(saved, gym, plan);
    }

    public List<UserMembershipResponse> getUserMemberships(Long userId) {
        List<Membership> memberships = membershipRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        // Auto-expire memberships
        LocalDate today = LocalDate.now();
        memberships.forEach(membership -> {
            if (membership.getStatus() == MembershipStatus.ACTIVE && 
                membership.getEndDate().isBefore(today)) {
                membership.setStatus(MembershipStatus.EXPIRED);
                membershipRepository.save(membership);
            }
        });
        
        return memberships.stream()
                .map(membership -> {
                    Gym gym = gymRepository.findById(membership.getGymId()).orElse(null);
                    GymPlan plan = planRepository.findById(membership.getPlanId()).orElse(null);
                    return mapToUserResponse(membership, gym, plan);
                })
                .toList();
    }

    public List<MembershipResponse> getUserMembershipsAdmin(Long userId) {
        List<Membership> memberships = membershipRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        return memberships.stream()
                .map(membership -> {
                    Gym gym = gymRepository.findById(membership.getGymId()).orElse(null);
                    GymPlan plan = planRepository.findById(membership.getPlanId()).orElse(null);
                    return mapToResponse(membership, gym, plan);
                })
                .toList();
    }

    private UserMembershipResponse mapToUserResponse(Membership membership, Gym gym, GymPlan plan) {
        UserMembershipResponse response = new UserMembershipResponse();
        response.setId(membership.getId());
        response.setGymName(gym != null ? gym.getGymName() : "Unknown Gym");
        response.setPlanName(plan != null ? plan.getPlanName() : "Unknown Plan");
        response.setStartDate(membership.getStartDate());
        response.setEndDate(membership.getEndDate());
        response.setStatus(membership.getStatus());
        response.setPrice(plan != null ? plan.getPrice().doubleValue() : null);
        response.setDurationDays(plan != null ? plan.getDurationDays() : null);
        return response;
    }

    private MembershipResponse mapToResponse(Membership membership, Gym gym, GymPlan plan) {
        MembershipResponse response = new MembershipResponse();
        response.setId(membership.getId());
        response.setGymId(membership.getGymId());
        response.setGymName(gym != null ? gym.getGymName() : "Unknown Gym");
        response.setPlanId(membership.getPlanId());
        response.setPlanName(plan != null ? plan.getPlanName() : "Unknown Plan");
        response.setStartDate(membership.getStartDate());
        response.setEndDate(membership.getEndDate());
        response.setStatus(membership.getStatus());
        response.setPrice(plan != null ? plan.getPrice().doubleValue() : null);
        response.setDurationDays(plan != null ? plan.getDurationDays() : null);
        return response;
    }
}