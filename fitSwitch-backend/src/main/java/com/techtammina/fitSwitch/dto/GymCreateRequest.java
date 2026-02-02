package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GymCreateRequest {
    
    @NotBlank(message = "Gym name is required")
    private String gymName;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;
    private String state;
    private String pincode;

    private String contactNumber;

    private Double latitude;
    private Double longitude;

    private String openTime;
    private String closeTime;
}
