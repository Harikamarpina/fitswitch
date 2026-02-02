package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.UserDashboardStatsResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.UserDashboardStatsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/dashboard")
public class UserDashboardStatsController {

    private final UserDashboardStatsService userDashboardStatsService;
    private final UserRepository userRepository;

    public UserDashboardStatsController(UserDashboardStatsService userDashboardStatsService, UserRepository userRepository) {
        this.userDashboardStatsService = userDashboardStatsService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping("/stats")
    public UserDashboardStatsResponse getDashboardStats(Authentication auth) {
        return userDashboardStatsService.getUserDashboardStats(getUserId(auth));
    }
}