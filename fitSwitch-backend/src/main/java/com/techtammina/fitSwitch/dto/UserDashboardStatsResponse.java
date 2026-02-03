package com.techtammina.fitSwitch.dto;

import java.time.LocalDate;
import java.util.List;

public class UserDashboardStatsResponse {
    
    private int totalVisitDays;
    private LocalDate lastVisitDate;
    private List<ActiveMembershipDto> activeMemberships;
    private List<ActiveFacilitySubscriptionDto> activeFacilitySubscriptions;
    private List<SubscriptionExpiryDto> subscriptionExpiryDates;
    private String currentSessionStatus;

    // Getters and Setters
    public int getTotalVisitDays() { return totalVisitDays; }
    public void setTotalVisitDays(int totalVisitDays) { this.totalVisitDays = totalVisitDays; }

    public LocalDate getLastVisitDate() { return lastVisitDate; }
    public void setLastVisitDate(LocalDate lastVisitDate) { this.lastVisitDate = lastVisitDate; }

    public List<ActiveMembershipDto> getActiveMemberships() { return activeMemberships; }
    public void setActiveMemberships(List<ActiveMembershipDto> activeMemberships) { this.activeMemberships = activeMemberships; }

    public List<ActiveFacilitySubscriptionDto> getActiveFacilitySubscriptions() { return activeFacilitySubscriptions; }
    public void setActiveFacilitySubscriptions(List<ActiveFacilitySubscriptionDto> activeFacilitySubscriptions) { this.activeFacilitySubscriptions = activeFacilitySubscriptions; }

    public List<SubscriptionExpiryDto> getSubscriptionExpiryDates() { return subscriptionExpiryDates; }
    public void setSubscriptionExpiryDates(List<SubscriptionExpiryDto> subscriptionExpiryDates) { this.subscriptionExpiryDates = subscriptionExpiryDates; }

    public String getCurrentSessionStatus() { return currentSessionStatus; }
    public void setCurrentSessionStatus(String currentSessionStatus) { this.currentSessionStatus = currentSessionStatus; }

    public static class ActiveMembershipDto {
        private String gymName;
        private String planName;
        private LocalDate endDate;

        public String getGymName() { return gymName; }
        public void setGymName(String gymName) { this.gymName = gymName; }

        public String getPlanName() { return planName; }
        public void setPlanName(String planName) { this.planName = planName; }

        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    }

    public static class ActiveFacilitySubscriptionDto {
        private String gymName;
        private String facilityName;
        private String planName;
        private LocalDate endDate;

        public String getGymName() { return gymName; }
        public void setGymName(String gymName) { this.gymName = gymName; }

        public String getFacilityName() { return facilityName; }
        public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

        public String getPlanName() { return planName; }
        public void setPlanName(String planName) { this.planName = planName; }

        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    }

    public static class SubscriptionExpiryDto {
        private String type;
        private String name;
        private LocalDate expiryDate;

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    }
}