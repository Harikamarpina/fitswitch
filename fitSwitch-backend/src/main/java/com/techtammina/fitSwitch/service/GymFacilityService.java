package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.GymFacilityCreateRequest;
import com.techtammina.fitSwitch.dto.GymFacilityResponse;
import com.techtammina.fitSwitch.dto.GymFacilityUpdateRequest;
import com.techtammina.fitSwitch.entity.Gym;
import com.techtammina.fitSwitch.entity.GymFacility;
import com.techtammina.fitSwitch.repository.FacilityPlanRepository;
import com.techtammina.fitSwitch.repository.GymFacilityRepository;
import com.techtammina.fitSwitch.repository.GymRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GymFacilityService {

    private final GymFacilityRepository facilityRepository;
    private final GymRepository gymRepository;
    private final FacilityPlanRepository facilityPlanRepository;

    public GymFacilityService(GymFacilityRepository facilityRepository, GymRepository gymRepository, FacilityPlanRepository facilityPlanRepository) {
        this.facilityRepository = facilityRepository;
        this.gymRepository = gymRepository;
        this.facilityPlanRepository = facilityPlanRepository;
    }

    public GymFacilityResponse addFacility(Long ownerId, GymFacilityCreateRequest request) {
        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(request.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        GymFacility facility = new GymFacility();
        facility.setGymId(request.getGymId());
        facility.setFacilityName(request.getFacilityName());
        facility.setDescription(request.getDescription());
        facility.setActive(true);
        facility.setCreatedAt(LocalDateTime.now());
        facility.setUpdatedAt(LocalDateTime.now());

        GymFacility saved = facilityRepository.save(facility);
        return mapToResponse(saved);
    }

    public GymFacilityResponse updateFacility(Long ownerId, Long facilityId, GymFacilityUpdateRequest request) {
        GymFacility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(facility.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        if (request.getFacilityName() != null) facility.setFacilityName(request.getFacilityName());
        if (request.getDescription() != null) facility.setDescription(request.getDescription());
        if (request.getActive() != null) facility.setActive(request.getActive());
        facility.setUpdatedAt(LocalDateTime.now());

        GymFacility updated = facilityRepository.save(facility);
        return mapToResponse(updated);
    }

    public List<GymFacilityResponse> getFacilitiesForGymOwner(Long ownerId, Long gymId) {
        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        return facilityRepository.findByGymId(gymId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<GymFacilityResponse> getFacilitiesForGymPublic(Long gymId) {
        return facilityRepository.findByGymIdAndActiveTrue(gymId)
                .stream()
                .map(this::mapToResponseWithPlans)
                .toList();
    }

    private GymFacilityResponse mapToResponse(GymFacility facility) {
        GymFacilityResponse response = new GymFacilityResponse();
        response.setId(facility.getId());
        response.setGymId(facility.getGymId());
        response.setFacilityName(facility.getFacilityName());
        response.setDescription(facility.getDescription());
        response.setActive(facility.isActive());
        return response;
    }

    private GymFacilityResponse mapToResponseWithPlans(GymFacility facility) {
        GymFacilityResponse response = mapToResponse(facility);
        boolean hasPlans = !facilityPlanRepository.findByFacilityIdAndActiveTrue(facility.getId()).isEmpty();
        response.setHasPlans(hasPlans);
        return response;
    }

    public GymFacilityResponse getFacilityById(Long ownerId, Long facilityId) {
    GymFacility facility = facilityRepository.findById(facilityId)
            .orElseThrow(() -> new RuntimeException("Facility not found"));

    Gym gym = gymRepository.findById(facility.getGymId())
            .orElseThrow(() -> new RuntimeException("Gym not found"));

    if (!gym.getOwnerId().equals(ownerId)) {
        throw new RuntimeException("Access denied");
    }

    return mapToResponse(facility);
}

}