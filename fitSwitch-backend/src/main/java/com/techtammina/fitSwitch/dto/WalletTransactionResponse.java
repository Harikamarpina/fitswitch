package com.techtammina.fitSwitch.dto;

import com.techtammina.fitSwitch.entity.WalletTransaction.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WalletTransactionResponse {
    private Long id;
    private TransactionType type;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String description;
    private String gymName;
    private String facilityName;
    private LocalDateTime createdAt;

    // Constructors
    public WalletTransactionResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(BigDecimal balanceAfter) { this.balanceAfter = balanceAfter; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getGymName() { return gymName; }
    public void setGymName(String gymName) { this.gymName = gymName; }

    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}