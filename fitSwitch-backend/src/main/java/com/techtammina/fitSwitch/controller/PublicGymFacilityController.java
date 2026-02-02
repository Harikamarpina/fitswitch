package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.GymFacilityResponse;
import com.techtammina.fitSwitch.service.GymFacilityService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/gyms")
public class PublicGymFacilityController {

    private final GymFacilityService facilityService;

    public PublicGymFacilityController(GymFacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping("/{gymId}/facilities")
    public List<GymFacilityResponse> getGymFacilitiesPublic(@PathVariable Long gymId) {
        return facilityService.getFacilitiesForGymPublic(gymId);
    }
}