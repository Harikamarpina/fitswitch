package com.techtammina.fitSwitch.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class OwnerUserStatsResponse {
    
    private Long userId;
    private String userName;
    private String email;
    private List<UserMembershipDto> memberships;
    private List<UserFacilitySubscriptionDto> facilitySubscriptions;
    private List<UserSessionHistoryResponse> sessionHistory;
    private int totalVisitCount;
    private LocalDateTime lastCheckIn;
    private LocalDateTime lastCheckOut;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<UserMembershipDto> getMemberships() { return memberships; }
    public void setMemberships(List<UserMembershipDto> memberships) { this.memberships = memberships; }

    public List<UserFacilitySubscriptionDto> getFacilitySubscriptions() { return facilitySubscriptions; }
    public void setFacilitySubscriptions(List<UserFacilitySubscriptionDto> facilitySubscriptions) { this.facilitySubscriptions = facilitySubscriptions; }

    public List<UserSessionHistoryResponse> getSessionHistory() { return sessionHistory; }
    public void setSessionHistory(List<UserSessionHistoryResponse> sessionHistory) { this.sessionHistory = sessionHistory; }

    public int getTotalVisitCount() { return totalVisitCount; }
    public void setTotalVisitCount(int totalVisitCount) { this.totalVisitCount = totalVisitCount; }

    public LocalDateTime getLastCheckIn() { return lastCheckIn; }
    public void setLastCheckIn(LocalDateTime lastCheckIn) { this.lastCheckIn = lastCheckIn; }

    public LocalDateTime getLastCheckOut() { return lastCheckOut; }
    public void setLastCheckOut(LocalDateTime lastCheckOut) { this.lastCheckOut = lastCheckOut; }

    public static class UserMembershipDto {
        private String planName;
        private LocalDate purchaseDate;
        private LocalDate expiryDate;
        private String status;

        public String getPlanName() { return planName; }
        public void setPlanName(String planName) { this.planName = planName; }

        public LocalDate getPurchaseDate() { return purchaseDate; }
        public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class UserFacilitySubscriptionDto {
        private String facilityName;
        private String planName;
        private LocalDate purchaseDate;
        private LocalDate expiryDate;
        private String status;

        public String getFacilityName() { return facilityName; }
        public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

        public String getPlanName() { return planName; }
        public void setPlanName(String planName) { this.planName = planName; }

        public LocalDate getPurchaseDate() { return purchaseDate; }
        public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
