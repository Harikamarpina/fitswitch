package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.FacilityPlanCreateRequest;
import com.techtammina.fitSwitch.dto.FacilityPlanResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.FacilityPlanService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner/facilities/{facilityId}/plans")
public class OwnerFacilityPlanController {

    private final FacilityPlanService facilityPlanService;
    private final UserRepository userRepository;

    public OwnerFacilityPlanController(FacilityPlanService facilityPlanService, UserRepository userRepository) {
        this.facilityPlanService = facilityPlanService;
        this.userRepository = userRepository;
    }

    private Long getOwnerId(Authentication auth) {
        String email = auth.getName();
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return owner.getId();
    }

    @PostMapping
    public FacilityPlanResponse createFacilityPlan(@PathVariable Long facilityId,
                                                  @Valid @RequestBody FacilityPlanCreateRequest request,
                                                  Authentication auth) {
        return facilityPlanService.createFacilityPlan(getOwnerId(auth), facilityId, request);
    }

    @GetMapping
    public List<FacilityPlanResponse> getFacilityPlans(@PathVariable Long facilityId,
                                                      Authentication auth) {
        return facilityPlanService.getOwnerFacilityPlans(getOwnerId(auth), facilityId);
    }
}