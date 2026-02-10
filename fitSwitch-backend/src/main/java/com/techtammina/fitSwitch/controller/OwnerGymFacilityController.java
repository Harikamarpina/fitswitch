package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.GymFacilityCreateRequest;
import com.techtammina.fitSwitch.dto.GymFacilityResponse;
import com.techtammina.fitSwitch.dto.GymFacilityUpdateRequest;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.GymFacilityService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/owner/facilities")
public class OwnerGymFacilityController {

    private final GymFacilityService facilityService;
    private final UserRepository userRepository;

    public OwnerGymFacilityController(GymFacilityService facilityService, UserRepository userRepository) {
        this.facilityService = facilityService;
        this.userRepository = userRepository;
    }

    private Long getOwnerId(Authentication auth) {
        String email = auth.getName();
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return owner.getId();
    }

    @PostMapping
    public GymFacilityResponse addFacility(@Valid @RequestBody GymFacilityCreateRequest request,
                                          Authentication auth) {
        return facilityService.addFacility(getOwnerId(auth), request);
    }

    @PutMapping("/{facilityId}")
    public GymFacilityResponse updateFacility(@PathVariable Long facilityId,
                                              @Valid @RequestBody GymFacilityUpdateRequest request,
                                              Authentication auth) {
        return facilityService.updateFacility(getOwnerId(auth), facilityId, request);
    }

    @GetMapping("/gym/{gymId}")
    public List<GymFacilityResponse> getGymFacilitiesOwner(@PathVariable Long gymId,
                                                           Authentication auth) {
        return facilityService.getFacilitiesForGymOwner(getOwnerId(auth), gymId);
    }


    @GetMapping("/{facilityId}")
    public GymFacilityResponse getFacility(@PathVariable Long facilityId, Authentication auth) {
    return facilityService.getFacilityById(getOwnerId(auth), facilityId);
}

}
