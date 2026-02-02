package com.techtammina.fitSwitch.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GymResponse {
    private Long id;
    private String gymName;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String contactNumber;

    private Double latitude;
    private Double longitude;

    private String openTime;
    private String closeTime;

    private boolean active;
}

