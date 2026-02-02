package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.FacilityPlanResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.FacilityPlanService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner/facility-plans")
public class OwnerAllFacilityPlansController {

    private final FacilityPlanService facilityPlanService;
    private final UserRepository userRepository;

    public OwnerAllFacilityPlansController(FacilityPlanService facilityPlanService, UserRepository userRepository) {
        this.facilityPlanService = facilityPlanService;
        this.userRepository = userRepository;
    }

    private Long getOwnerId(Authentication auth) {
        String email = auth.getName();
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return owner.getId();
    }

    @GetMapping
    public List<FacilityPlanResponse> getAllFacilityPlans(Authentication auth) {
        return facilityPlanService.getAllOwnerFacilityPlans(getOwnerId(auth));
    }
}