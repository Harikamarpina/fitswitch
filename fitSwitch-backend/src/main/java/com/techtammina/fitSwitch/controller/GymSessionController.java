package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.GymSessionResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/session")
public class GymSessionController {

    @PostMapping("/check-in")
    public ResponseEntity<GymSessionResponse> checkIn() {
        GymSessionResponse errorResponse = new GymSessionResponse();
        errorResponse.setMessage("Deprecated endpoint. Use /user/membership-session/check-in with membershipId.");
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @PostMapping("/check-out")
    public ResponseEntity<GymSessionResponse> checkOut() {
        GymSessionResponse errorResponse = new GymSessionResponse();
        errorResponse.setMessage("Deprecated endpoint. Use /user/membership-session/check-out with membershipId.");
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
