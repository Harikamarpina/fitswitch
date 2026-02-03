package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.GymUserResponse;
import com.techtammina.fitSwitch.dto.OwnerUserStatsResponse;
import com.techtammina.fitSwitch.dto.PlanUserResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.OwnerStatsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner/gyms/{gymId}")
public class OwnerStatsController {

    private final OwnerStatsService ownerStatsService;
    private final UserRepository userRepository;

    public OwnerStatsController(OwnerStatsService ownerStatsService, UserRepository userRepository) {
        this.ownerStatsService = ownerStatsService;
        this.userRepository = userRepository;
    }

    private Long getOwnerId(Authentication auth) {
        String email = auth.getName();
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return owner.getId();
    }

    @GetMapping("/users")
    public List<GymUserResponse> getGymUsers(@PathVariable Long gymId, Authentication auth) {
        return ownerStatsService.getGymUsers(getOwnerId(auth), gymId);
    }

    @GetMapping("/users/{userId}/stats")
    public OwnerUserStatsResponse getUserStats(@PathVariable Long gymId, 
                                             @PathVariable Long userId, 
                                             Authentication auth) {
        return ownerStatsService.getUserStats(getOwnerId(auth), gymId, userId);
    }

    @GetMapping("/plans/{planId}/users")
    public List<PlanUserResponse> getGymPlanUsers(@PathVariable Long gymId,
                                                @PathVariable Long planId,
                                                Authentication auth) {
        return ownerStatsService.getGymPlanUsers(getOwnerId(auth), gymId, planId);
    }

    @GetMapping("/facilities/{facilityId}/plans/{planId}/users")
    public List<PlanUserResponse> getFacilityPlanUsers(@PathVariable Long gymId,
                                                     @PathVariable Long facilityId,
                                                     @PathVariable Long planId,
                                                     Authentication auth) {
        return ownerStatsService.getFacilityPlanUsers(getOwnerId(auth), facilityId, planId);
    }
}