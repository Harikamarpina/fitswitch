package com.techtammina.fitSwitch.dto;

public class GymFacilityResponse {
    
    private Long id;
    private Long gymId;
    private String facilityName;
    private String description;
    private boolean active;
    private boolean hasPlans;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isHasPlans() { return hasPlans; }
    public void setHasPlans(boolean hasPlans) { this.hasPlans = hasPlans; }
}