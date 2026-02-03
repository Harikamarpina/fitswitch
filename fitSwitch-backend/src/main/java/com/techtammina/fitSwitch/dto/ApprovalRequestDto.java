package com.techtammina.fitSwitch.dto;

public class ApprovalRequestDto {
    
    private String ownerNotes;

    // Constructors
    public ApprovalRequestDto() {}

    public ApprovalRequestDto(String ownerNotes) {
        this.ownerNotes = ownerNotes;
    }

    // Getters and Setters
    public String getOwnerNotes() { return ownerNotes; }
    public void setOwnerNotes(String ownerNotes) { this.ownerNotes = ownerNotes; }
}