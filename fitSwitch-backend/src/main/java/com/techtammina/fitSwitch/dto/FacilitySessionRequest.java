package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class FacilitySessionRequest {

    @NotNull(message = "Facility subscription ID is required")
    @Positive(message = "Facility subscription ID must be a positive number")
    private Long facilitySubscriptionId;

    public Long getFacilitySubscriptionId() { return facilitySubscriptionId; }
    public void setFacilitySubscriptionId(Long facilitySubscriptionId) { this.facilitySubscriptionId = facilitySubscriptionId; }
}
