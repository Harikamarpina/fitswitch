package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.*;
import com.techtammina.fitSwitch.service.WalletService;
import com.techtammina.fitSwitch.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    private final WalletService walletService;
    private final JwtUtils jwtUtils;

    public WalletController(WalletService walletService, JwtUtils jwtUtils) {
        this.walletService = walletService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/balance")
    public ResponseEntity<WalletResponse> getWalletBalance(HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        WalletResponse wallet = walletService.getOrCreateWallet(userId);
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/add-money")
    public ResponseEntity<WalletResponse> addMoney(
            @Valid @RequestBody AddMoneyRequest addMoneyRequest,
            HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        WalletResponse wallet = walletService.addMoney(userId, addMoneyRequest);
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/use-facility")
    public ResponseEntity<ApiResponse> useFacility(
            @Valid @RequestBody FacilityUsageRequest facilityUsageRequest,
            HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        ApiResponse response = walletService.useFacility(userId, facilityUsageRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<WalletTransactionResponse>> getTransactionHistory(HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        List<WalletTransactionResponse> transactions = walletService.getTransactionHistory(userId);
        return ResponseEntity.ok(transactions);
    }
}