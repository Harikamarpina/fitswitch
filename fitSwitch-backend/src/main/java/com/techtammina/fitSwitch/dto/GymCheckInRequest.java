package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class GymCheckInRequest {
    
    @NotNull(message = "Gym ID is required")
    @Positive(message = "Gym ID must be a positive number")
    private Long gymId;

    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }
}
