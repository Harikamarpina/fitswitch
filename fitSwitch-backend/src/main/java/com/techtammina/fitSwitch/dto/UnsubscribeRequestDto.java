package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;

public class UnsubscribeRequestDto {
    
    @NotNull(message = "Membership ID is required")
    private Long membershipId;
    
    private String reason;

    // Constructors
    public UnsubscribeRequestDto() {}

    public UnsubscribeRequestDto(Long membershipId, String reason) {
        this.membershipId = membershipId;
        this.reason = reason;
    }

    // Getters and Setters
    public Long getMembershipId() { return membershipId; }
    public void setMembershipId(Long membershipId) { this.membershipId = membershipId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}