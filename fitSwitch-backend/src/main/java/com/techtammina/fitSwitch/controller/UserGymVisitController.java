package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.CheckInRequest;
import com.techtammina.fitSwitch.dto.GymVisitResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.GymVisitService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/visit")
public class UserGymVisitController {

    private final GymVisitService gymVisitService;
    private final UserRepository userRepository;

    public UserGymVisitController(GymVisitService gymVisitService, UserRepository userRepository) {
        this.gymVisitService = gymVisitService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping("/check-in")
    public GymVisitResponse checkIn(@Valid @RequestBody CheckInRequest request,
                                   Authentication auth) {
        return gymVisitService.checkIn(getUserId(auth), request);
    }

    @PostMapping("/check-out")
    public GymVisitResponse checkOut(Authentication auth) {
        return gymVisitService.checkOut(getUserId(auth));
    }
}