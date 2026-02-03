package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.GymCheckInRequest;
import com.techtammina.fitSwitch.dto.GymSessionResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.GymSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/session")
public class GymSessionController {

    private final GymSessionService gymSessionService;
    private final UserRepository userRepository;

    public GymSessionController(GymSessionService gymSessionService, UserRepository userRepository) {
        this.gymSessionService = gymSessionService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping("/check-in")
    public ResponseEntity<GymSessionResponse> checkIn(@RequestBody GymCheckInRequest request,
                                                     Authentication auth) {
        try {
            GymSessionResponse response = gymSessionService.checkIn(getUserId(auth), request.getGymId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            GymSessionResponse errorResponse = new GymSessionResponse();
            errorResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/check-out")
    public ResponseEntity<GymSessionResponse> checkOut(Authentication auth) {
        try {
            GymSessionResponse response = gymSessionService.checkOut(getUserId(auth));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            GymSessionResponse errorResponse = new GymSessionResponse();
            errorResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}