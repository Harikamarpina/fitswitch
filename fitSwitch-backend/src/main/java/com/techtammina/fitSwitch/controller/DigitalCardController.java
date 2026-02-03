package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.GymSessionResponse;
import com.techtammina.fitSwitch.service.DigitalCardService;
import com.techtammina.fitSwitch.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/digital-card")
@CrossOrigin(origins = "*")
public class DigitalCardController {

    private final DigitalCardService digitalCardService;
    private final JwtUtils jwtUtils;

    public DigitalCardController(DigitalCardService digitalCardService, JwtUtils jwtUtils) {
        this.digitalCardService = digitalCardService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/checkin")
    public ResponseEntity<GymSessionResponse> checkInWithDigitalCard(
            @RequestParam Long gymId,
            @RequestParam Long facilityId,
            HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        GymSessionResponse response = digitalCardService.checkInWithDigitalCard(userId, gymId, facilityId);
        return ResponseEntity.ok(response);
    }
}