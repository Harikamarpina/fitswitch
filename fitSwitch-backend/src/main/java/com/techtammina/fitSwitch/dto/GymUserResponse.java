package com.techtammina.fitSwitch.dto;

import java.time.LocalDate;

public class GymUserResponse {
    
    private Long userId;
    private String userName;
    private String email;
    private String membershipStatus;
    private String facilitySubscriptionStatus;
    private LocalDate lastVisitDate;
    private int totalVisits;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMembershipStatus() { return membershipStatus; }
    public void setMembershipStatus(String membershipStatus) { this.membershipStatus = membershipStatus; }

    public String getFacilitySubscriptionStatus() { return facilitySubscriptionStatus; }
    public void setFacilitySubscriptionStatus(String facilitySubscriptionStatus) { this.facilitySubscriptionStatus = facilitySubscriptionStatus; }

    public LocalDate getLastVisitDate() { return lastVisitDate; }
    public void setLastVisitDate(LocalDate lastVisitDate) { this.lastVisitDate = lastVisitDate; }

    public int getTotalVisits() { return totalVisits; }
    public void setTotalVisits(int totalVisits) { this.totalVisits = totalVisits; }
}