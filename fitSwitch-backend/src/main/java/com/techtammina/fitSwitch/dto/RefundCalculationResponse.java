package com.techtammina.fitSwitch.dto;

import java.math.BigDecimal;

public class RefundCalculationResponse {
    
    private BigDecimal refundAmount;
    private BigDecimal remainingAmount;
    private BigDecimal ownerShare;
    private Integer usedMonths;
    private Integer remainingMonths;

    public RefundCalculationResponse() {}

    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

    public BigDecimal getOwnerShare() { return ownerShare; }
    public void setOwnerShare(BigDecimal ownerShare) { this.ownerShare = ownerShare; }

    public Integer getUsedMonths() { return usedMonths; }
    public void setUsedMonths(Integer usedMonths) { this.usedMonths = usedMonths; }

    public Integer getRemainingMonths() { return remainingMonths; }
    public void setRemainingMonths(Integer remainingMonths) { this.remainingMonths = remainingMonths; }
}