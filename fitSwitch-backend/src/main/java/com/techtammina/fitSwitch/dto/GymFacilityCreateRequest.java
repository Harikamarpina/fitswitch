package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class GymFacilityCreateRequest {
    
    @NotNull(message = "Gym ID is required")
    @Positive(message = "Gym ID must be a positive number")
    private Long gymId;
    
    @NotBlank(message = "Facility name is required")
    @Size(min = 2, max = 80, message = "Facility name must be between 2 and 80 characters")
    private String facilityName;
    
    @Size(max = 300, message = "Description must be at most 300 characters")
    private String description;

    // Getters and Setters
    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
