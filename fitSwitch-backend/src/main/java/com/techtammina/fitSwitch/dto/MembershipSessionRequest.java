package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class MembershipSessionRequest {

    @NotNull(message = "Membership ID is required")
    @Positive(message = "Membership ID must be a positive number")
    private Long membershipId;

    public Long getMembershipId() { return membershipId; }
    public void setMembershipId(Long membershipId) { this.membershipId = membershipId; }
}
