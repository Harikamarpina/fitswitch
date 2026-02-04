package com.techtammina.fitSwitch.controller;

import com.techtammina.fitSwitch.dto.UserMembershipHistoryResponse;
import com.techtammina.fitSwitch.dto.UserFacilityHistoryResponse;
import com.techtammina.fitSwitch.dto.UserSessionHistoryResponse;
import com.techtammina.fitSwitch.dto.FacilitySessionHistoryResponse;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.UserHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/history")
public class UserHistoryController {

    @Autowired
    private UserHistoryService userHistoryService;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping("/memberships")
    public ResponseEntity<List<UserMembershipHistoryResponse>> getMembershipHistory(Authentication auth) {
        Long userId = getUserId(auth);
        List<UserMembershipHistoryResponse> history = userHistoryService.getMembershipHistory(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/facilities")
    public ResponseEntity<List<UserFacilityHistoryResponse>> getFacilityHistory(Authentication auth) {
        Long userId = getUserId(auth);
        List<UserFacilityHistoryResponse> history = userHistoryService.getFacilityHistory(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<UserSessionHistoryResponse>> getSessionHistory(Authentication auth) {
        Long userId = getUserId(auth);
        List<UserSessionHistoryResponse> history = userHistoryService.getSessionHistory(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/facility-sessions")
    public ResponseEntity<List<FacilitySessionHistoryResponse>> getFacilitySessionHistory(Authentication auth) {
        Long userId = getUserId(auth);
        List<FacilitySessionHistoryResponse> history = userHistoryService.getFacilitySessionHistory(userId);
        return ResponseEntity.ok(history);
    }
}
