package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.ApiResponse;
import com.techtammina.fitSwitch.dto.MembershipSwitchRequest;
import com.techtammina.fitSwitch.service.MembershipSwitchService;
import com.techtammina.fitSwitch.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/membership")
@CrossOrigin(origins = "*")
public class MembershipSwitchController {

    private final MembershipSwitchService membershipSwitchService;
    private final JwtUtils jwtUtils;

    public MembershipSwitchController(MembershipSwitchService membershipSwitchService, JwtUtils jwtUtils) {
        this.membershipSwitchService = membershipSwitchService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/switch")
    public ResponseEntity<ApiResponse> switchMembership(
            @Valid @RequestBody MembershipSwitchRequest switchRequest,
            HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        ApiResponse response = membershipSwitchService.switchMembership(userId, switchRequest);
        return ResponseEntity.ok(response);
    }
}