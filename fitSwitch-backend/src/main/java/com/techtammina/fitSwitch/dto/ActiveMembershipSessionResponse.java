package com.techtammina.fitSwitch.dto;

import java.time.LocalDateTime;

public class ActiveMembershipSessionResponse {
    private Long sessionId;
    private Long membershipId;
    private Long gymId;
    private String gymName;
    private String planName;
    private LocalDateTime checkInTime;

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Long getMembershipId() { return membershipId; }
    public void setMembershipId(Long membershipId) { this.membershipId = membershipId; }

    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public String getGymName() { return gymName; }
    public void setGymName(String gymName) { this.gymName = gymName; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }
}
