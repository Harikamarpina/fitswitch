package com.techtammina.fitSwitch.dto;

import com.techtammina.fitSwitch.entity.UnsubscribeRequest.RequestStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UnsubscribeRequestResponse {
    
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long membershipId;
    private String gymName;
    private String planName;
    private RequestStatus status;
    private LocalDateTime requestDate;
    private LocalDateTime approvalDate;
    private BigDecimal refundAmount;
    private BigDecimal remainingAmount;
    private BigDecimal ownerShare;
    private Integer usedMonths;
    private Integer totalMonths;
    private String reason;
    private String ownerNotes;

    // Constructors
    public UnsubscribeRequestResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Long getMembershipId() { return membershipId; }
    public void setMembershipId(Long membershipId) { this.membershipId = membershipId; }

    public String getGymName() { return gymName; }
    public void setGymName(String gymName) { this.gymName = gymName; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

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