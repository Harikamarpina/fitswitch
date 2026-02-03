package com.techtammina.fitSwitch.dto;

import java.time.LocalDate;

public class OwnerGymMemberResponse {
    private Long userId;
    private String userName;
    private String email;
    private String planName;
    private String planType; // "GYM" or "FACILITY"
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private LocalDate lastVisitDate;

    // Constructors
    public OwnerGymMemberResponse() {}

    public OwnerGymMemberResponse(Long userId, String userName, String email, 
                                String planName, String planType, LocalDate startDate, 
                                LocalDate endDate, String status, LocalDate lastVisitDate) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.planName = planName;
        this.planType = planType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.lastVisitDate = lastVisitDate;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getLastVisitDate() { return lastVisitDate; }
    public void setLastVisitDate(LocalDate lastVisitDate) { this.lastVisitDate = lastVisitDate; }
}