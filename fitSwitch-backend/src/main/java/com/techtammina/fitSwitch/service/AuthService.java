package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.*;
import com.techtammina.fitSwitch.entity.OtpVerification;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.enums.Role;
import com.techtammina.fitSwitch.repository.OtpVerificationRepository;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public ApiResponse<String> register(RegisterRequest request) {
        User existingUser = userRepository.findByEmail(request.getEmail()).orElse(null);
        
        if (existingUser != null && existingUser.isEnabled()) {
            return ApiResponse.error("Email is already registered");
        }
        
        // If user exists but not verified, delete and allow re-registration
        if (existingUser != null && !existingUser.isEnabled()) {
            otpRepository.deleteByEmail(request.getEmail());
            userRepository.delete(existingUser);
            userRepository.flush(); // Force immediate database update
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        user.setEnabled(false);
        user.setCreatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));

        userRepository.save(user);

        // Generate and send OTP
        String otp = generateOtp();
        OtpVerification otpVerification = new OtpVerification(
            request.getEmail(), 
            otp, 
            LocalDateTime.now(ZoneId.of("Asia/Kolkata")).plusMinutes(10)
        );
        
        otpRepository.save(otpVerification);

        try {
            emailService.sendOtpEmail(request.getEmail(), otp);
            return ApiResponse.success("Registration successful. Please check your email for OTP verification.");
        } catch (Exception e) {
            return ApiResponse.error("Registration successful but failed to send OTP email. Please try again.");
        }
    }

    @Transactional
    public ApiResponse<String> verifyOtp(VerifyOtpRequest request) {
        OtpVerification otpVerification = otpRepository
            .findByEmailAndOtpAndVerifiedFalse(request.getEmail(), request.getOtp())
            .orElse(null);

        if (otpVerification == null) {
            return ApiResponse.error("Invalid OTP");
        }

        if (otpVerification.getExpiresAt().isBefore(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))) {
            return ApiResponse.error("OTP has expired");
        }

        // Mark OTP as verified
        otpVerification.setVerified(true);
        otpRepository.save(otpVerification);

        // Enable user
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);

        return ApiResponse.success("Email verified successfully. You can now login.");
    }

    public ApiResponse<JwtResponse> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElse(null);

        if (user == null) {
            return ApiResponse.error("Invalid email or password");
        }

        if (!user.isEnabled()) {
            return ApiResponse.error("Account not verified. Please verify your email first.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            JwtResponse jwtResponse = new JwtResponse(jwt, user.getEmail(), user.getRole().name(), user.getId());
            return ApiResponse.success("Login successful", jwtResponse);
        } catch (Exception e) {
            return ApiResponse.error("Invalid email or password");
        }
    }

    private String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

    @Transactional
    public ApiResponse<String> resendOtp(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ApiResponse.error("User not found");
        }

        if (user.isEnabled()) {
            return ApiResponse.error("Account already verified");
        }

        String otp = generateOtp();
        OtpVerification otpVerification = new OtpVerification(
            email, 
            otp, 
            LocalDateTime.now(ZoneId.of("Asia/Kolkata")).plusMinutes(10)
        );
        
        otpRepository.deleteByEmail(email);
        otpRepository.save(otpVerification);

        try {
            emailService.sendOtpEmail(email, otp);
            return ApiResponse.success("OTP sent successfully. Please check your email.");
        } catch (Exception e) {
            return ApiResponse.error("Failed to send OTP. Please try again.");
        }
    }
}