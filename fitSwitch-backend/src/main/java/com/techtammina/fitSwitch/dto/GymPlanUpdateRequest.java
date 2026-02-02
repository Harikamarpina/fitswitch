package com.techtammina.fitSwitch.dto;

import java.math.BigDecimal;

public class GymPlanUpdateRequest {

    private String planName;
    private String description;
    private Integer durationDays;
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
