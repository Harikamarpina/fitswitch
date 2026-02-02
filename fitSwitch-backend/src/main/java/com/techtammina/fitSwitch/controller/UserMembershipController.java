package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.MembershipCreateRequest;
import com.techtammina.fitSwitch.dto.MembershipResponse;
import com.techtammina.fitSwitch.dto.UserMembershipResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.MembershipService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/memberships")
public class UserMembershipController {

    private final MembershipService membershipService;
    private final UserRepository userRepository;

    public UserMembershipController(MembershipService membershipService, UserRepository userRepository) {
        this.membershipService = membershipService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping
    public MembershipResponse createMembership(@Valid @RequestBody MembershipCreateRequest request,
                                             Authentication auth) {
        return membershipService.createMembership(getUserId(auth), request);
    }

    @GetMapping
    public List<UserMembershipResponse> getUserMemberships(Authentication auth) {
        return membershipService.getUserMemberships(getUserId(auth));
    }
}