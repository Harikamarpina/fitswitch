package com.techtammina.fitSwitch.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "gym_plans")
@Getter
@Setter
public class GymPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long gymId;

    @Column(nullable = false)
    private String planName;  // Monthly, Quarterly, Yearly

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Integer durationDays; // ex: 30, 90, 365

    @Column(nullable = false)
    private BigDecimal price; // 999, 2499 etc.

    @Column(nullable = false)
    private boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gymId", insertable = false, updatable = false)
    private Gym gym;

    @JsonIgnore
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Membership> memberships;
}
