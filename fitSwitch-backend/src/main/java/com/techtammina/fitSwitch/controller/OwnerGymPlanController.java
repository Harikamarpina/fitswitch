package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.GymPlanCreateRequest;
import com.techtammina.fitSwitch.dto.GymPlanResponse;
import com.techtammina.fitSwitch.dto.GymPlanUpdateRequest;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.GymPlanService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner/plans")
public class OwnerGymPlanController {

    private final GymPlanService planService;
    private final UserRepository userRepository;

    public OwnerGymPlanController(GymPlanService planService, UserRepository userRepository) {
        this.planService = planService;
        this.userRepository = userRepository;
    }

    private Long getOwnerId(Authentication auth) {
        String email = auth.getName();
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return owner.getId();
    }

    @PostMapping
    public GymPlanResponse createPlan(@Valid @RequestBody GymPlanCreateRequest request,
                                     Authentication auth) {
        return planService.createPlan(getOwnerId(auth), request);
    }

    @PutMapping("/{planId}")
    public GymPlanResponse updatePlan(@PathVariable Long planId,
                                      @RequestBody GymPlanUpdateRequest request,
                                      Authentication auth) {
        return planService.updatePlan(getOwnerId(auth), planId, request);
    }

    @GetMapping("/{planId}")
    public GymPlanResponse getPlan(@PathVariable Long planId,
                                   Authentication auth) {
        return planService.getPlan(getOwnerId(auth), planId);
    }

    @GetMapping("/gym/{gymId}")
    public List<GymPlanResponse> getPlansForOwnerGym(@PathVariable Long gymId,
                                                     Authentication auth) {
        return planService.getOwnerGymPlans(getOwnerId(auth), gymId);
    }
}
