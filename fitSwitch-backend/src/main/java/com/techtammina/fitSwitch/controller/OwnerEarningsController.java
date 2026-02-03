package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.service.OwnerEarningsService;
import com.techtammina.fitSwitch.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/owner/earnings")
@CrossOrigin(origins = "*")
public class OwnerEarningsController {

    private final OwnerEarningsService ownerEarningsService;
    private final JwtUtils jwtUtils;

    public OwnerEarningsController(OwnerEarningsService ownerEarningsService, JwtUtils jwtUtils) {
        this.ownerEarningsService = ownerEarningsService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    public ResponseEntity<List<OwnerEarningsService.OwnerEarningResponse>> getOwnerEarnings(HttpServletRequest request) {
        Long ownerId = jwtUtils.getUserIdFromRequest(request);
        List<OwnerEarningsService.OwnerEarningResponse> earnings = ownerEarningsService.getOwnerEarnings(ownerId);
        return ResponseEntity.ok(earnings);
    }

    @GetMapping("/gym/{gymId}")
    public ResponseEntity<List<OwnerEarningsService.OwnerEarningResponse>> getGymEarnings(
            @PathVariable Long gymId,
            HttpServletRequest request) {
        Long ownerId = jwtUtils.getUserIdFromRequest(request);
        List<OwnerEarningsService.OwnerEarningResponse> earnings = ownerEarningsService.getGymEarnings(ownerId, gymId);
        return ResponseEntity.ok(earnings);
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalEarnings(HttpServletRequest request) {
        Long ownerId = jwtUtils.getUserIdFromRequest(request);
        BigDecimal total = ownerEarningsService.getTotalEarnings(ownerId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/gym/{gymId}/total")
    public ResponseEntity<BigDecimal> getGymTotalEarnings(
            @PathVariable Long gymId,
            HttpServletRequest request) {
        Long ownerId = jwtUtils.getUserIdFromRequest(request);
        BigDecimal total = ownerEarningsService.getGymTotalEarnings(ownerId, gymId);
        return ResponseEntity.ok(total);
    }
}