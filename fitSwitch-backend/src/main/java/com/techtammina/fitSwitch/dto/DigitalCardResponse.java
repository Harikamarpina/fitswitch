package com.techtammina.fitSwitch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class DigitalCardResponse {
    private String userName;
    private String userEmail;
    private BigDecimal walletBalance;
    private List<ActiveMembershipDto> activeMemberships;
    private List<ActiveSubscriptionDto> activeSubscriptions;

    public static class ActiveMembershipDto {
        private Long membershipId;
        private Long gymId;
        private String gymName;
        private String planName;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;

        // Getters and setters
        public Long getMembershipId() { return membershipId; }
        public void setMembershipId(Long membershipId) { this.membershipId = membershipId; }
        public Long getGymId() { return gymId; }
        public void setGymId(Long gymId) { this.gymId = gymId; }
        public String getGymName() { return gymName; }
        public void setGymName(String gymName) { this.gymName = gymName; }
        public String getPlanName() { return planName; }
        public void setPlanName(String planName) { this.planName = planName; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class ActiveSubscriptionDto {
        private Long subscriptionId;
        private Long gymId;
        private Long facilityId;
        private String gymName;
        private String facilityName;
        private String planName;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;

        // Getters and setters
        public Long getSubscriptionId() { return subscriptionId; }
        public void setSubscriptionId(Long subscriptionId) { this.subscriptionId = subscriptionId; }
        public Long getGymId() { return gymId; }
        public void setGymId(Long gymId) { this.gymId = gymId; }
        public Long getFacilityId() { return facilityId; }
        public void setFacilityId(Long facilityId) { this.facilityId = facilityId; }
        public String getGymName() { return gymName; }
        public void setGymName(String gymName) { this.gymName = gymName; }
        public String getFacilityName() { return facilityName; }
        public void setFacilityName(String facilityName) { this.facilityName = facilityName; }
        public String getPlanName() { return planName; }
        public void setPlanName(String planName) { this.planName = planName; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    // Main class getters and setters
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public BigDecimal getWalletBalance() { return walletBalance; }
    public void setWalletBalance(BigDecimal walletBalance) { this.walletBalance = walletBalance; }
    public List<ActiveMembershipDto> getActiveMemberships() { return activeMemberships; }
    public void setActiveMemberships(List<ActiveMembershipDto> activeMemberships) { this.activeMemberships = activeMemberships; }
    public List<ActiveSubscriptionDto> getActiveSubscriptions() { return activeSubscriptions; }
    public void setActiveSubscriptions(List<ActiveSubscriptionDto> activeSubscriptions) { this.activeSubscriptions = activeSubscriptions; }
}