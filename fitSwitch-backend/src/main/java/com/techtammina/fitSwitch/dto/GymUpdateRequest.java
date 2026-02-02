package com.techtammina.fitSwitch.dto;

import lombok.Data;

@Data
public class GymUpdateRequest {

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

    private Boolean active;
}
