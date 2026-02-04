package com.techtammina.fitSwitch.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class FacilitySessionHistoryResponse {
    private Long id;
    private String gymName;
    private String facilityName;
    private LocalDate visitDate;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String status;

    public FacilitySessionHistoryResponse() {}

    public FacilitySessionHistoryResponse(Long id, String gymName, String facilityName, LocalDate visitDate,
                                          LocalDateTime checkInTime, LocalDateTime checkOutTime, String status) {
        this.id = id;
        this.gymName = gymName;
        this.facilityName = facilityName;
        this.visitDate = visitDate;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGymName() { return gymName; }
    public void setGymName(String gymName) { this.gymName = gymName; }

    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
