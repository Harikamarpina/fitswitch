package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class GymPlanUpdateRequest {

    @Size(min = 2, max = 80, message = "Plan name must be between 2 and 80 characters")
    private String planName;

    @Size(max = 300, message = "Description must be at most 300 characters")
    private String description;

    @Positive(message = "Duration (days) must be greater than 0")
    private Integer durationDays;

    @Positive(message = "Price must be greater than 0")
    private BigDecimal price;
    private Boolean active;

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
