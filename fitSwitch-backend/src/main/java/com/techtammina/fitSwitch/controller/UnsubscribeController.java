package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.*;
import com.techtammina.fitSwitch.service.UnsubscribeService;
import com.techtammina.fitSwitch.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UnsubscribeController {

    private final UnsubscribeService unsubscribeService;
    private final JwtUtils jwtUtils;

    public UnsubscribeController(UnsubscribeService unsubscribeService, JwtUtils jwtUtils) {
        this.unsubscribeService = unsubscribeService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/user/membership/{membershipId}/refund-calculation")
    public ResponseEntity<RefundCalculationResponse> getRefundCalculation(
            @PathVariable Long membershipId,
            HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        RefundCalculationResponse calculation = unsubscribeService.getRefundCalculation(userId, membershipId);
        return ResponseEntity.ok(calculation);
    }

    @PostMapping("/user/subscription/unsubscribe")
    public ResponseEntity<ApiResponse> createUnsubscribeRequest(
            @Valid @RequestBody UnsubscribeRequestDto request,
            HttpServletRequest httpRequest) {
        Long userId = jwtUtils.getUserIdFromRequest(httpRequest);
        ApiResponse response = unsubscribeService.createUnsubscribeRequest(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/unsubscribe-requests")
    public ResponseEntity<List<UnsubscribeRequestResponse>> getUserUnsubscribeRequests(
            HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        List<UnsubscribeRequestResponse> requests = unsubscribeService.getUserUnsubscribeRequests(userId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/owner/unsubscribe-requests")
    public ResponseEntity<List<UnsubscribeRequestResponse>> getOwnerUnsubscribeRequests(
            HttpServletRequest request) {
        Long ownerId = jwtUtils.getUserIdFromRequest(request);
        List<UnsubscribeRequestResponse> requests = unsubscribeService.getOwnerUnsubscribeRequests(ownerId);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/owner/unsubscribe-requests/{id}/approve")
    public ResponseEntity<ApiResponse> approveUnsubscribeRequest(
            @PathVariable Long id,
            @RequestBody ApprovalRequestDto approval,
            HttpServletRequest request) {
        Long ownerId = jwtUtils.getUserIdFromRequest(request);
        ApiResponse response = unsubscribeService.approveUnsubscribeRequest(ownerId, id, approval);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/owner/unsubscribe-requests/{id}/reject")
    public ResponseEntity<ApiResponse> rejectUnsubscribeRequest(
            @PathVariable Long id,
            @RequestBody ApprovalRequestDto rejection,
            HttpServletRequest request) {
        Long ownerId = jwtUtils.getUserIdFromRequest(request);
        ApiResponse response = unsubscribeService.rejectUnsubscribeRequest(ownerId, id, rejection);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/owner/refund-requests")
    public ResponseEntity<List<UnsubscribeRequestResponse>> getApprovedRefundRequests(
            HttpServletRequest request) {
        Long ownerId = jwtUtils.getUserIdFromRequest(request);
        List<UnsubscribeRequestResponse> requests = unsubscribeService.getApprovedRefundRequests(ownerId);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/owner/refund-requests/{id}/process")
    public ResponseEntity<ApiResponse> processRefund(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long ownerId = jwtUtils.getUserIdFromRequest(request);
        ApiResponse response = unsubscribeService.processRefund(ownerId, id);
        return ResponseEntity.ok(response);
    }
}