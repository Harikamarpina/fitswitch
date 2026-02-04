package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.DigitalCardResponse;
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

    @GetMapping("/data")
    public ResponseEntity<DigitalCardResponse> getDigitalCardData(HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        DigitalCardResponse cardData = digitalCardService.getDigitalCardData(userId);
        return ResponseEntity.ok(cardData);
    }
}