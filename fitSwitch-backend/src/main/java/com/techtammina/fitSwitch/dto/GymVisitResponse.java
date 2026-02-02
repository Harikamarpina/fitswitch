package com.techtammina.fitSwitch.dto;

import com.techtammina.fitSwitch.entity.GymVisitStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class GymVisitResponse {

    private Long id;
    private String gymName;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private LocalDate visitDate;
    private GymVisitStatus status;

    // Constructors
    public GymVisitResponse() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGymName() {
        return gymName;
    }

    public void setGymName(String gymName) {
        this.gymName = gymName;
    }

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalDateTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public GymVisitStatus getStatus() {
        return status;
    }

    public void setStatus(GymVisitStatus status) {
        this.status = status;
    }
}