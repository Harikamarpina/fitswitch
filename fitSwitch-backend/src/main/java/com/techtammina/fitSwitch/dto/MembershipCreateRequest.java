package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class MembershipCreateRequest {

    @NotNull(message = "Gym ID is required")
    @Positive(message = "Gym ID must be a positive number")
    private Long gymId;

    @NotNull(message = "Plan ID is required")
    @Positive(message = "Plan ID must be a positive number")
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
