package com.techtammina.fitSwitch.dto;

import com.techtammina.fitSwitch.entity.MembershipStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public class UserMembershipHistoryResponse {
    private Long id;
    private String gymName;
    private String planName;
    private LocalDate purchaseDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Double price;
    private Integer durationDays;

    // Constructors
    public UserMembershipHistoryResponse() {}

    public UserMembershipHistoryResponse(Long id, String gymName, String planName, 
                                       LocalDate startDate, LocalDate endDate, 
                                       MembershipStatus status, BigDecimal price, Integer durationDays) {
        this.id = id;
        this.gymName = gymName;
        this.planName = planName;
        this.purchaseDate = startDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status.toString();
        this.price = price != null ? price.doubleValue() : null;
        this.durationDays = durationDays;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGymName() { return gymName; }
    public void setGymName(String gymName) { this.gymName = gymName; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
}