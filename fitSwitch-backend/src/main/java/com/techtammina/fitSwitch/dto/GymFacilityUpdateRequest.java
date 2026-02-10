package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.Size;

public class GymFacilityUpdateRequest {
    
    @Size(min = 2, max = 80, message = "Facility name must be between 2 and 80 characters")
    private String facilityName;

    @Size(max = 300, message = "Description must be at most 300 characters")
    private String description;
    private Boolean active;

    // Getters and Setters
    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
