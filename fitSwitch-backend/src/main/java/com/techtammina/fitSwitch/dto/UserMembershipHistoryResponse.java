package com.techtammina.fitSwitch.dto;

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

    // Constructors
    public UserMembershipHistoryResponse() {}

    public UserMembershipHistoryResponse(Long id, String gymName, String planName, 
                                       LocalDate startDate, LocalDate startDate2, 
                                       LocalDate endDate, String status, Double price) {
        this.id = id;
        this.gymName = gymName;
        this.planName = planName;
        this.purchaseDate = startDate; // Using startDate as purchaseDate
        this.startDate = startDate2;
        this.endDate = endDate;
        this.status = status;
        this.price = price;
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
}