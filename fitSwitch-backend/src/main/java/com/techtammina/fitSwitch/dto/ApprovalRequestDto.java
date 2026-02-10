package com.techtammina.fitSwitch.dto;

import jakarta.validation.constraints.Size;

public class ApprovalRequestDto {
    
    @Size(max = 300, message = "Notes must be at most 300 characters")
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
