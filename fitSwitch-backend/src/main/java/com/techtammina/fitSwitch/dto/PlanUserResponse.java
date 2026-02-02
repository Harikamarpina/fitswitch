package com.techtammina.fitSwitch.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlanUserResponse {
    
    private Long userId;
    private String userName;
    private String email;
    private LocalDate purchaseDate;
    private LocalDate expiryDate;
    private String status;
    private int totalVisits;
    private LocalDate lastVisitDate;
    private LocalDateTime lastCheckIn;
    private String planType; // "MEMBERSHIP" or "FACILITY"

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalVisits() { return totalVisits; }
    public void setTotalVisits(int totalVisits) { this.totalVisits = totalVisits; }

    public LocalDate getLastVisitDate() { return lastVisitDate; }
    public void setLastVisitDate(LocalDate lastVisitDate) { this.lastVisitDate = lastVisitDate; }

    public LocalDateTime getLastCheckIn() { return lastCheckIn; }
    public void setLastCheckIn(LocalDateTime lastCheckIn) { this.lastCheckIn = lastCheckIn; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }
}