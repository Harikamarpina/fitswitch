package com.techtammina.fitSwitch.dto;

import java.time.LocalDateTime;

public class OwnerTodayVisitResponse {
    private Long userId;
    private String userName;
    private String email;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String status;
    private String planType; // "GYM" or "FACILITY"

    // Constructors
    public OwnerTodayVisitResponse() {}

    public OwnerTodayVisitResponse(Long userId, String userName, String email, 
                                 LocalDateTime checkInTime, LocalDateTime checkOutTime, 
                                 String status) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.status = status;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }
}