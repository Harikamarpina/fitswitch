package com.techtammina.fitSwitch.dto;

import com.techtammina.fitSwitch.enums.PassType;

public class GymPlanResponse {
    
    private Long id;
    private Long gymId;
    private String planName;
    private String description;
    private Double price;
    private Integer durationDays;
    private Integer durationMonths;
    private PassType passType;
    private boolean active;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }

    public PassType getPassType() { return passType; }
    public void setPassType(PassType passType) { this.passType = passType; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}