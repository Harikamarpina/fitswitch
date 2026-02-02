package com.techtammina.fitSwitch.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import com.techtammina.fitSwitch.dto.GymCreateRequest;
import com.techtammina.fitSwitch.dto.GymResponse;
import com.techtammina.fitSwitch.dto.GymUpdateRequest;
import com.techtammina.fitSwitch.entity.User;
import com.techtammina.fitSwitch.repository.UserRepository;
import com.techtammina.fitSwitch.service.GymService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/owner/gyms")
public class OwnerGymController {
   
    private final GymService gymService;
    
    @Autowired
    private UserRepository userRepository;

    public OwnerGymController(GymService gymService) {
        this.gymService = gymService;
    }

    @PostMapping
    public GymResponse createGym(@Valid @RequestBody GymCreateRequest request, Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long ownerId = user.getId();
        return gymService.createGym(ownerId, request);
    }

     @PutMapping("/{gymId}")
    public GymResponse updateGym(@PathVariable Long gymId,
                                 @RequestBody GymUpdateRequest request,
                                 Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long ownerId = user.getId();
        return gymService.updateGym(ownerId, gymId, request);
    }

    @GetMapping
    public List<GymResponse> ownerGyms(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Long ownerId = user.getId();
        return gymService.getOwnerGyms(ownerId);
    }
    
}
