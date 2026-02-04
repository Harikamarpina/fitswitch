package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;

public class FacilitySessionRequest {

    @NotNull(message = "Facility subscription ID is required")
    private Long facilitySubscriptionId;

    public Long getFacilitySubscriptionId() { return facilitySubscriptionId; }
    public void setFacilitySubscriptionId(Long facilitySubscriptionId) { this.facilitySubscriptionId = facilitySubscriptionId; }
}
