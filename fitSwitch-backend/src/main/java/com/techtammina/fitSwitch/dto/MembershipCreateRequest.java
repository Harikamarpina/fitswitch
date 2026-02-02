package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;

public class MembershipCreateRequest {

    @NotNull(message = "Gym ID is required")
    private Long gymId;

    @NotNull(message = "Plan ID is required")
    private Long planId;

    // Constructors
    public MembershipCreateRequest() {}

    // Getters and Setters
    public Long getGymId() {
        return gymId;
    }

    public void setGymId(Long gymId) {
        this.gymId = gymId;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }
}