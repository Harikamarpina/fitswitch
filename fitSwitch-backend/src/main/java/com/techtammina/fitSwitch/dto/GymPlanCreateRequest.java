package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class GymPlanCreateRequest {

    @NotNull(message = "Gym ID is required")
    private Long gymId;

    @NotBlank(message = "Plan name is required")
    private String planName;

    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotNull(message = "Duration is required")
    private Integer durationDays;

    public Long getGymId() {
        return gymId;
    }

    public void setGymId(Long gymId) {
        this.gymId = gymId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {        // ✅ must be BigDecimal
        return price;
    }

    public void setPrice(BigDecimal price) {   // ✅ must be BigDecimal
        this.price = price;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }
}
