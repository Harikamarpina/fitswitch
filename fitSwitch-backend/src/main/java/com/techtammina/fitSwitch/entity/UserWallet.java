package com.techtammina.fitSwitch.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_wallets")
public class UserWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Relationships
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", insertable = false, updatable = false)
    private User user;

    // Constructors
    public UserWallet() {}

    public UserWallet(Long userId, BigDecimal balance) {
        this.userId = userId;
        this.balance = balance;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { 
        this.balance = balance;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}