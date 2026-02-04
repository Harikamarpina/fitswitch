package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;

public class MembershipSessionRequest {

    @NotNull(message = "Membership ID is required")
    private Long membershipId;

    public Long getMembershipId() { return membershipId; }
    public void setMembershipId(Long membershipId) { this.membershipId = membershipId; }
}
