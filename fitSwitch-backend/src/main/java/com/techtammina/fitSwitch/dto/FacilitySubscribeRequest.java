package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;

public class FacilitySubscribeRequest {

    @NotNull(message = "Facility plan ID is required")
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