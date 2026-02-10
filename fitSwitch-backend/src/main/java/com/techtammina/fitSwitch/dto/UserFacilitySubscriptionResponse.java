package com.techtammina.fitSwitch.dto;

import com.techtammina.fitSwitch.entity.FacilitySubscriptionStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public class UserFacilitySubscriptionResponse {

    private Long id;
    private Long gymId;
    private Long facilityId;
    private Long facilityPlanId;
    private String gymName;
    private String facilityName;
    private String planName;
    private LocalDate startDate;
    private LocalDate endDate;
    private FacilitySubscriptionStatus status;
    private BigDecimal price;
    private Integer durationDays;

    // Constructors
    public UserFacilitySubscriptionResponse() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGymId() {
        return gymId;
    }

    public void setGymId(Long gymId) {
        this.gymId = gymId;
    }

    public Long getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(Long facilityId) {
        this.facilityId = facilityId;
    }

    public Long getFacilityPlanId() {
        return facilityPlanId;
    }

    public void setFacilityPlanId(Long facilityPlanId) {
        this.facilityPlanId = facilityPlanId;
    }

    public String getGymName() {
        return gymName;
    }

    public void setGymName(String gymName) {
        this.gymName = gymName;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public void setFacilityName(String facilityName) {
        this.facilityName = facilityName;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public FacilitySubscriptionStatus getStatus() {
        return status;
    }

    public void setStatus(FacilitySubscriptionStatus status) {
        this.status = status;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }
}
