package com.techtammina.fitSwitch.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "unsubscribe_requests")
public class UnsubscribeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long membershipId;

    @Column(nullable = false)
    private Long gymId;

    @Column(nullable = false)
    private Long ownerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime requestDate;

    private LocalDateTime approvalDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal refundAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal remainingAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal ownerShare = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer usedMonths;

    @Column(nullable = false)
    private Integer totalMonths;

    @Column(length = 500)
    private String reason;

    @Column(length = 500)
    private String ownerNotes;

    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED,
        REFUNDED
    }

    // Constructors
    public UnsubscribeRequest() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getMembershipId() { return membershipId; }
    public void setMembershipId(Long membershipId) { this.membershipId = membershipId; }

    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }

    public LocalDateTime getApprovalDate() { return approvalDate; }
    public void setApprovalDate(LocalDateTime approvalDate) { this.approvalDate = approvalDate; }

    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

    public BigDecimal getOwnerShare() { return ownerShare; }
    public void setOwnerShare(BigDecimal ownerShare) { this.ownerShare = ownerShare; }

    public Integer getUsedMonths() { return usedMonths; }
    public void setUsedMonths(Integer usedMonths) { this.usedMonths = usedMonths; }

    public Integer getTotalMonths() { return totalMonths; }
    public void setTotalMonths(Integer totalMonths) { this.totalMonths = totalMonths; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getOwnerNotes() { return ownerNotes; }
    public void setOwnerNotes(String ownerNotes) { this.ownerNotes = ownerNotes; }
}
