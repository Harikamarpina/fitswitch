package com.techtammina.fitSwitch.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transactions")
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long walletId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceAfter;

    @Column(length = 500)
    private String description;

    // Optional references for tracking source/destination
    private Long gymId;
    private Long facilityId;
    private Long membershipId;
    private Long sessionId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public enum TransactionType {
        ADD_MONEY,           // User adds money to wallet
        FACILITY_USAGE,      // Pay-per-use facility access
        MEMBERSHIP_REFUND,   // Refund from membership switch
        MEMBERSHIP_SWITCH,   // Payment for new membership after switch
        OWNER_EARNING       // Owner receives payment
    }

    // Constructors
    public WalletTransaction() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getWalletId() { return walletId; }
    public void setWalletId(Long walletId) { this.walletId = walletId; }

    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(BigDecimal balanceAfter) { this.balanceAfter = balanceAfter; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public Long getFacilityId() { return facilityId; }
    public void setFacilityId(Long facilityId) { this.facilityId = facilityId; }

    public Long getMembershipId() { return membershipId; }
    public void setMembershipId(Long membershipId) { this.membershipId = membershipId; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}