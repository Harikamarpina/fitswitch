package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.FacilityPlanResponse;
import com.techtammina.fitSwitch.service.FacilityPlanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gyms/{gymId}/facility-plans")
public class PublicGymFacilityPlansController {

    private final FacilityPlanService facilityPlanService;

    public PublicGymFacilityPlansController(FacilityPlanService facilityPlanService) {
        this.facilityPlanService = facilityPlanService;
    }

    @GetMapping
    public List<FacilityPlanResponse> getGymFacilityPlans(@PathVariable Long gymId) {
        return facilityPlanService.getGymFacilityPlansGrouped(gymId);
    }
}