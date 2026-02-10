package com.techtammina.fitSwitch.dto;

import com.techtammina.fitSwitch.enums.PassType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class GymPlanCreateRequest {

    @NotNull(message = "Gym ID is required")
    @Positive(message = "Gym ID must be a positive number")
    private Long gymId;

    @NotBlank(message = "Plan name is required")
    @Size(min = 2, max = 80, message = "Plan name must be between 2 and 80 characters")
    private String planName;

    @Size(max = 300, message = "Description must be at most 300 characters")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration (days) must be greater than 0")
    private Integer durationDays;

    @NotNull(message = "Duration in months is required")
    @Positive(message = "Duration (months) must be greater than 0")
    private Integer durationMonths;

    @NotNull(message = "Pass type is required")
    private PassType passType = PassType.REGULAR;

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

    public Integer getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }

    public PassType getPassType() {
        return passType;
    }

    public void setPassType(PassType passType) {
        this.passType = passType;
    }
}
