package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.GymPlanCreateRequest;
import com.techtammina.fitSwitch.dto.GymPlanResponse;
import com.techtammina.fitSwitch.dto.GymPlanUpdateRequest;
import com.techtammina.fitSwitch.entity.Gym;
import com.techtammina.fitSwitch.entity.GymPlan;
import com.techtammina.fitSwitch.repository.GymPlanRepository;
import com.techtammina.fitSwitch.repository.GymRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GymPlanService {

    private final GymPlanRepository planRepository;
    private final GymRepository gymRepository;

    public GymPlanService(GymPlanRepository planRepository, GymRepository gymRepository) {
        this.planRepository = planRepository;
        this.gymRepository = gymRepository;
    }

    public GymPlanResponse createPlan(Long ownerId, GymPlanCreateRequest request) {

        Gym gym = gymRepository.findById(request.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        GymPlan plan = new GymPlan();
        plan.setGymId(request.getGymId());
        plan.setPlanName(request.getPlanName());
        plan.setDescription(request.getDescription());
        plan.setDurationDays(request.getDurationDays());
        plan.setDurationMonths(request.getDurationMonths());
        plan.setPrice(request.getPrice());
        plan.setPassType(request.getPassType());
        plan.setActive(true);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());

        GymPlan saved = planRepository.save(plan);

        return mapToResponse(saved);
    }

    public GymPlanResponse updatePlan(Long ownerId, Long planId, GymPlanUpdateRequest request) {

        GymPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        Gym gym = gymRepository.findById(plan.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        if (request.getPlanName() != null) plan.setPlanName(request.getPlanName());
        if (request.getDescription() != null) plan.setDescription(request.getDescription());
        if (request.getDurationDays() != null) plan.setDurationDays(request.getDurationDays());
        if (request.getPrice() != null) plan.setPrice(request.getPrice());
        if (request.getActive() != null) plan.setActive(request.getActive());

        plan.setUpdatedAt(LocalDateTime.now());

        GymPlan updated = planRepository.save(plan);

        return mapToResponse(updated);
    }

    public GymPlanResponse getPlan(Long ownerId, Long planId) {
        GymPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        Gym gym = gymRepository.findById(plan.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        return mapToResponse(plan);
    }

    public List<GymPlanResponse> getOwnerGymPlans(Long ownerId, Long gymId) {

        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        return planRepository.findByGymId(gymId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<GymPlanResponse> getPublicGymPlans(Long gymId) {
        return planRepository.findByGymIdAndActiveTrue(gymId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private GymPlanResponse mapToResponse(GymPlan plan) {
        GymPlanResponse response = new GymPlanResponse();
        response.setId(plan.getId());
        response.setGymId(plan.getGymId());
        response.setPlanName(plan.getPlanName());
        response.setDescription(plan.getDescription());
        response.setDurationDays(plan.getDurationDays());
        response.setDurationMonths(plan.getDurationMonths());
        response.setPassType(plan.getPassType());
        response.setPrice(plan.getPrice() != null ? plan.getPrice().doubleValue() : null);
        response.setActive(plan.isActive());
        return response;
    }
}
