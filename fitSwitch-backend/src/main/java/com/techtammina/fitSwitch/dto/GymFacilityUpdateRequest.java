package com.techtammina.fitSwitch.dto;

public class GymFacilityUpdateRequest {
    
    private String facilityName;
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