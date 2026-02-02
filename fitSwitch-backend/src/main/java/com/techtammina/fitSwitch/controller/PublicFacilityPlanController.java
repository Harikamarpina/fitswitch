package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.FacilityPlanResponse;
import com.techtammina.fitSwitch.service.FacilityPlanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gyms/{gymId}/facilities/{facilityId}/plans")
public class PublicFacilityPlanController {

    private final FacilityPlanService facilityPlanService;

    public PublicFacilityPlanController(FacilityPlanService facilityPlanService) {
        this.facilityPlanService = facilityPlanService;
    }

    @GetMapping
    public List<FacilityPlanResponse> getFacilityPlans(@PathVariable Long gymId, 
                                                      @PathVariable Long facilityId) {
        return facilityPlanService.getPublicFacilityPlans(gymId, facilityId);
    }
}