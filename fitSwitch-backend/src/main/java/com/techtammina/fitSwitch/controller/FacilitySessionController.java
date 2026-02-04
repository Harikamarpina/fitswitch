package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.FacilitySessionRequest;
import com.techtammina.fitSwitch.dto.FacilitySessionResponse;
import com.techtammina.fitSwitch.dto.ActiveFacilitySessionResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.FacilitySessionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/facility-session")
public class FacilitySessionController {

    private final FacilitySessionService sessionService;
    private final UserRepository userRepository;

    public FacilitySessionController(FacilitySessionService sessionService, UserRepository userRepository) {
        this.sessionService = sessionService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping("/check-in")
    public ResponseEntity<FacilitySessionResponse> checkIn(
            @Valid @RequestBody FacilitySessionRequest request,
            Authentication auth) {
        try {
            FacilitySessionResponse response = sessionService.checkIn(getUserId(auth), request.getFacilitySubscriptionId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            FacilitySessionResponse error = new FacilitySessionResponse();
            error.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/check-out")
    public ResponseEntity<FacilitySessionResponse> checkOut(
            @Valid @RequestBody FacilitySessionRequest request,
            Authentication auth) {
        try {
            FacilitySessionResponse response = sessionService.checkOut(getUserId(auth), request.getFacilitySubscriptionId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            FacilitySessionResponse error = new FacilitySessionResponse();
            error.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/current")
    public ResponseEntity<FacilitySessionResponse> getCurrent(
            @RequestParam Long facilitySubscriptionId,
            Authentication auth) {
        try {
            FacilitySessionResponse response = sessionService.getCurrent(getUserId(auth), facilitySubscriptionId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            FacilitySessionResponse error = new FacilitySessionResponse();
            error.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/today")
    public ResponseEntity<Boolean> hasAccessedToday(
            @RequestParam Long facilitySubscriptionId,
            Authentication auth) {
        return ResponseEntity.ok(sessionService.hasAccessedToday(getUserId(auth), facilitySubscriptionId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<ActiveFacilitySessionResponse>> getActiveSessions(Authentication auth) {
        return ResponseEntity.ok(sessionService.getActiveSessions(getUserId(auth)));
    }
}
