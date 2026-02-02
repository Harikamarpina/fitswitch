package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.FacilityPlanCreateRequest;
import com.techtammina.fitSwitch.dto.FacilityPlanResponse;
import com.techtammina.fitSwitch.entity.FacilityPlan;
import com.techtammina.fitSwitch.entity.Gym;
import com.techtammina.fitSwitch.entity.GymFacility;
import com.techtammina.fitSwitch.repository.FacilityPlanRepository;
import com.techtammina.fitSwitch.repository.GymFacilityRepository;
import com.techtammina.fitSwitch.repository.GymRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FacilityPlanService {

    private final FacilityPlanRepository facilityPlanRepository;
    private final GymFacilityRepository gymFacilityRepository;
    private final GymRepository gymRepository;

    public FacilityPlanService(FacilityPlanRepository facilityPlanRepository,
                              GymFacilityRepository gymFacilityRepository,
                              GymRepository gymRepository) {
        this.facilityPlanRepository = facilityPlanRepository;
        this.gymFacilityRepository = gymFacilityRepository;
        this.gymRepository = gymRepository;
    }

    public FacilityPlanResponse createFacilityPlan(Long ownerId, Long facilityId, FacilityPlanCreateRequest request) {
        // Validate facility exists
        GymFacility facility = gymFacilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        // Validate gym belongs to owner
        Gym gym = gymRepository.findById(facility.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        // Create facility plan
        FacilityPlan plan = new FacilityPlan();
        plan.setGymId(facility.getGymId());
        plan.setFacilityId(facilityId);
        plan.setPlanName(request.getPlanName());
        plan.setDescription(request.getDescription());
        plan.setDurationDays(request.getDurationDays());
        plan.setPrice(request.getPrice());
        plan.setActive(true);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());

        FacilityPlan saved = facilityPlanRepository.save(plan);
        return mapToResponse(saved, gym, facility);
    }

    public List<FacilityPlanResponse> getOwnerFacilityPlans(Long ownerId, Long facilityId) {
        // Validate facility exists and belongs to owner
        GymFacility facility = gymFacilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        Gym gym = gymRepository.findById(facility.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        List<FacilityPlan> plans = facilityPlanRepository.findByFacilityId(facilityId);
        return plans.stream()
                .map(plan -> mapToResponse(plan, gym, facility))
                .toList();
    }

    public List<FacilityPlanResponse> getPublicFacilityPlans(Long gymId, Long facilityId) {
        // Validate facility belongs to gym
        GymFacility facility = gymFacilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        if (!facility.getGymId().equals(gymId)) {
            throw new RuntimeException("Facility does not belong to this gym");
        }

        Gym gym = gymRepository.findById(gymId).orElse(null);
        List<FacilityPlan> plans = facilityPlanRepository.findByFacilityIdAndActiveTrue(facilityId);
        
        return plans.stream()
                .map(plan -> mapToResponse(plan, gym, facility))
                .toList();
    }

    private FacilityPlanResponse mapToResponse(FacilityPlan plan, Gym gym, GymFacility facility) {
        FacilityPlanResponse response = new FacilityPlanResponse();
        response.setId(plan.getId());
        response.setGymId(plan.getGymId());
        response.setGymName(gym != null ? gym.getGymName() : "Unknown Gym");
        response.setFacilityId(plan.getFacilityId());
        response.setFacilityName(facility != null ? facility.getFacilityName() : "Unknown Facility");
        response.setPlanName(plan.getPlanName());
        response.setDescription(plan.getDescription());
        response.setDurationDays(plan.getDurationDays());
        response.setPrice(plan.getPrice());
        response.setActive(plan.isActive());
        return response;
    }
}