package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotNull;

public class CheckInRequest {

    @NotNull(message = "Gym ID is required")
    private Long gymId;

    // Constructors
    public CheckInRequest() {}

    // Getters and Setters
    public Long getGymId() {
        return gymId;
    }

    public void setGymId(Long gymId) {
        this.gymId = gymId;
    }
}