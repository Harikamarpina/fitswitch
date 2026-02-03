package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;

public class FacilityUsageRequest {
    
    @NotNull(message = "Gym ID is required")
    private Long gymId;
    
    @NotNull(message = "Facility ID is required")
    private Long facilityId;

    // Constructors
    public FacilityUsageRequest() {}

    public FacilityUsageRequest(Long gymId, Long facilityId) {
        this.gymId = gymId;
        this.facilityId = facilityId;
    }

    // Getters and Setters
    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public Long getFacilityId() { return facilityId; }
    public void setFacilityId(Long facilityId) { this.facilityId = facilityId; }
}