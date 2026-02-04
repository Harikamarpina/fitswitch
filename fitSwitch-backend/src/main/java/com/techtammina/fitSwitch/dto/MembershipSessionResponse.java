package com.techtammina.fitSwitch.dto;

import java.time.LocalDateTime;

public class MembershipSessionResponse {
    private Long sessionId;
    private Long membershipId;
    private Long gymId;
    private String status;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String message;

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Long getMembershipId() { return membershipId; }
    public void setMembershipId(Long membershipId) { this.membershipId = membershipId; }

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
