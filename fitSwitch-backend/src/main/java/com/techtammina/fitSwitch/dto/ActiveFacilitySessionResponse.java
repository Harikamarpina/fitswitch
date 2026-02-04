package com.techtammina.fitSwitch.dto;

import java.time.LocalDateTime;

public class ActiveFacilitySessionResponse {
    private Long sessionId;
    private Long facilitySubscriptionId;
    private Long facilityId;
    private Long gymId;
    private String gymName;
    private String facilityName;
    private String planName;
    private LocalDateTime checkInTime;

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Long getFacilitySubscriptionId() { return facilitySubscriptionId; }
    public void setFacilitySubscriptionId(Long facilitySubscriptionId) { this.facilitySubscriptionId = facilitySubscriptionId; }

    public Long getFacilityId() { return facilityId; }
    public void setFacilityId(Long facilityId) { this.facilityId = facilityId; }

    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public String getGymName() { return gymName; }
    public void setGymName(String gymName) { this.gymName = gymName; }

    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }
}
