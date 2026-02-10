package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class MembershipSwitchRequest {
    
    @NotNull(message = "Current membership ID is required")
    @Positive(message = "Current membership ID must be a positive number")
    private Long currentMembershipId;

    @NotNull(message = "New gym ID is required")
    @Positive(message = "New gym ID must be a positive number")
    private Long newGymId;

    @NotNull(message = "New plan ID is required")
    @Positive(message = "New plan ID must be a positive number")
    private Long newPlanId;

    // Constructors
    public MembershipSwitchRequest() {}

    // Getters and Setters
    public Long getCurrentMembershipId() { return currentMembershipId; }
    public void setCurrentMembershipId(Long currentMembershipId) { this.currentMembershipId = currentMembershipId; }

    public Long getNewGymId() { return newGymId; }
    public void setNewGymId(Long newGymId) { this.newGymId = newGymId; }

    public Long getNewPlanId() { return newPlanId; }
    public void setNewPlanId(Long newPlanId) { this.newPlanId = newPlanId; }
}
