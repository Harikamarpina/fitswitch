package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.MembershipSessionRequest;
import com.techtammina.fitSwitch.dto.MembershipSessionResponse;
import com.techtammina.fitSwitch.dto.ActiveMembershipSessionResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.MembershipSessionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/membership-session")
public class MembershipSessionController {

    private final MembershipSessionService sessionService;
    private final UserRepository userRepository;

    public MembershipSessionController(MembershipSessionService sessionService, UserRepository userRepository) {
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
    public ResponseEntity<MembershipSessionResponse> checkIn(
            @Valid @RequestBody MembershipSessionRequest request,
            Authentication auth) {
        try {
            MembershipSessionResponse response = sessionService.checkIn(getUserId(auth), request.getMembershipId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            MembershipSessionResponse error = new MembershipSessionResponse();
            error.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/check-out")
    public ResponseEntity<MembershipSessionResponse> checkOut(
            @Valid @RequestBody MembershipSessionRequest request,
            Authentication auth) {
        try {
            MembershipSessionResponse response = sessionService.checkOut(getUserId(auth), request.getMembershipId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            MembershipSessionResponse error = new MembershipSessionResponse();
            error.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/current")
    public ResponseEntity<MembershipSessionResponse> getCurrent(
            @RequestParam Long membershipId,
            Authentication auth) {
        try {
            MembershipSessionResponse response = sessionService.getCurrent(getUserId(auth), membershipId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            MembershipSessionResponse error = new MembershipSessionResponse();
            error.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<ActiveMembershipSessionResponse>> getActiveSessions(Authentication auth) {
        return ResponseEntity.ok(sessionService.getActiveSessions(getUserId(auth)));
    }
}
