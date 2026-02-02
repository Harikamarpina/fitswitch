package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.FacilitySubscribeRequest;
import com.techtammina.fitSwitch.dto.UserFacilitySubscriptionResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.UserFacilitySubscriptionService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/facility")
public class UserFacilitySubscriptionController {

    private final UserFacilitySubscriptionService subscriptionService;
    private final UserRepository userRepository;

    public UserFacilitySubscriptionController(UserFacilitySubscriptionService subscriptionService,
                                             UserRepository userRepository) {
        this.subscriptionService = subscriptionService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping("/subscribe")
    public UserFacilitySubscriptionResponse subscribeFacility(@Valid @RequestBody FacilitySubscribeRequest request,
                                                             Authentication auth) {
        return subscriptionService.subscribeFacility(getUserId(auth), request);
    }

    @GetMapping("/subscriptions")
    public List<UserFacilitySubscriptionResponse> getUserFacilitySubscriptions(Authentication auth) {
        return subscriptionService.getUserFacilitySubscriptions(getUserId(auth));
    }
}