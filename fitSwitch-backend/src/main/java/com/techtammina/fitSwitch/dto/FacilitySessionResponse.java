package com.techtammina.fitSwitch.dto;

import java.time.LocalDateTime;

public class FacilitySessionResponse {
    private Long sessionId;
    private Long facilitySubscriptionId;
    private Long facilityId;
    private Long gymId;
    private String status;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String message;

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Long getFacilitySubscriptionId() { return facilitySubscriptionId; }
    public void setFacilitySubscriptionId(Long facilitySubscriptionId) { this.facilitySubscriptionId = facilitySubscriptionId; }

    public Long getFacilityId() { return facilityId; }
    public void setFacilityId(Long facilityId) { this.facilityId = facilityId; }

    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
