package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class FacilityUsageRequest {
    
    @NotNull(message = "Gym ID is required")
    @Positive(message = "Gym ID must be a positive number")
    private Long gymId;

    @NotNull(message = "Facility ID is required")
    @Positive(message = "Facility ID must be a positive number")
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
