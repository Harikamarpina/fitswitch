package com.techtammina.fitSwitch.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WalletResponse {
    private Long id;
    private Long userId;
    private BigDecimal balance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public WalletResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}