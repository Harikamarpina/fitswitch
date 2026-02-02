package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.repository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class OtpCleanupService {

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Scheduled(cron = "0 0 2 * * ?") // Daily at 2 AM
    @Transactional
    public void deleteExpiredOtps() {
        LocalDateTime cutoffTime = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        otpRepository.deleteExpiredOtps(cutoffTime);
    }
}