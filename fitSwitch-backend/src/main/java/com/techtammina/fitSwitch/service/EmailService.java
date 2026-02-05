package com.techtammina.fitSwitch.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("FitSwitch - Email Verification OTP");
        message.setText("Your OTP for email verification is: " + otp + "\n\nThis OTP will expire in 10 minutes.");
        
        mailSender.send(message);
    }

    public void sendRefundNotification(String userEmail, String gymName, BigDecimal refundAmount, boolean isImmediate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("FitSwitch - Refund Notification");
        
        String messageText;
        if (isImmediate) {
            messageText = String.format(
                "Your cancellation request for %s has been approved.\n\n" +
                "Refund Amount: ₹%.2f\n" +
                "The refund has been credited to your FitSwitch wallet.\n\n" +
                "Thank you for using FitSwitch!",
                gymName, refundAmount
            );
        } else {
            messageText = String.format(
                "Your cancellation request for %s has been approved.\n\n" +
                "Refund Amount: ₹%.2f\n" +
                "Your refund will be credited to your wallet within 2-4 business days.\n\n" +
                "Thank you for using FitSwitch!",
                gymName, refundAmount
            );
        }
        
        message.setText(messageText);
        mailSender.send(message);
    }

    public void sendOwnerBalanceNotification(String ownerEmail, String gymName, BigDecimal requiredAmount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(ownerEmail);
        message.setSubject("FitSwitch - Wallet Balance Alert");
        
        String messageText = String.format(
            "A refund request has been approved for your gym: %s\n\n" +
            "Required Refund Amount: ₹%.2f\n" +
            "Your current wallet balance is insufficient to process this refund.\n\n" +
            "Please add money to your wallet to complete the refund process.\n" +
            "The user will receive their refund within 2-4 business days.\n\n" +
            "Login to your FitSwitch account to add funds.",
            gymName, requiredAmount
        );
        
        message.setText(messageText);
        mailSender.send(message);
    }

    public void sendMembershipConfirmation(String userEmail, String gymName, String planName,
                                           LocalDate startDate, LocalDate endDate, BigDecimal amount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("FitSwitch - Membership Confirmation");

        String messageText = String.format(
            "Your membership is confirmed!\n\n" +
            "Gym: %s\n" +
            "Plan: %s\n" +
            "Start Date: %s\n" +
            "End Date: %s\n" +
            "Amount Paid: INR %.2f\n\n" +
            "Thank you for choosing FitSwitch.",
            gymName, planName, startDate, endDate, amount
        );

        message.setText(messageText);
        mailSender.send(message);
    }
}
