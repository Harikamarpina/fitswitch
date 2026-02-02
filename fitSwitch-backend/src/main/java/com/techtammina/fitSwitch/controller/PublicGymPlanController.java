package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.GymPlanResponse;
import com.techtammina.fitSwitch.service.GymPlanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gyms")
public class PublicGymPlanController {

    private final GymPlanService planService;

    public PublicGymPlanController(GymPlanService planService) {
        this.planService = planService;
    }

    @GetMapping("/{gymId}/plans")
    public List<GymPlanResponse> getPublicGymPlans(@PathVariable Long gymId) {
        return planService.getPublicGymPlans(gymId);
    }
}
