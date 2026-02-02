package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GymFacilityCreateRequest {
    
    @NotNull(message = "Gym ID is required")
    private Long gymId;
    
    @NotBlank(message = "Facility name is required")
    private String facilityName;
    
    private String description;

    // Getters and Setters
    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}