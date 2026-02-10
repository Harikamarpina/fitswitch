package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class FacilitySubscribeRequest {

    @NotNull(message = "Facility plan ID is required")
    @Positive(message = "Facility plan ID must be a positive number")
    private Long facilityPlanId;

    // Constructors
    public FacilitySubscribeRequest() {}

    // Getters and Setters
    public Long getFacilityPlanId() {
        return facilityPlanId;
    }

    public void setFacilityPlanId(Long facilityPlanId) {
        this.facilityPlanId = facilityPlanId;
    }
}
