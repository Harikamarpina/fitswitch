package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class GymUpdateRequest {

    @Size(min = 3, max = 100, message = "Gym name must be between 3 and 100 characters")
    private String gymName;

    @Size(min = 5, max = 200, message = "Address must be between 5 and 200 characters")
    private String address;

    @Size(max = 60, message = "City must be at most 60 characters")
    private String city;

    @Size(max = 60, message = "State must be at most 60 characters")
    private String state;

    @Pattern(regexp = "^(\\d{6})?$", message = "Pincode must be exactly 6 digits")
    private String pincode;

    @Pattern(regexp = "^(\\d{10})?$", message = "Contact number must be exactly 10 digits")
    private String contactNumber;

    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90.0")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90.0")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180.0")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180.0")
    private Double longitude;

    @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "Open time must be in HH:mm format")
    private String openTime;

    @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "Close time must be in HH:mm format")
    private String closeTime;

    private Boolean active;
}
