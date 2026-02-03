package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class AddMoneyRequest {
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Amount must be at least 1.0")
    private BigDecimal amount;

    // Constructors
    public AddMoneyRequest() {}

    public AddMoneyRequest(BigDecimal amount) {
        this.amount = amount;
    }

    // Getters and Setters
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}