package com.techtammina.fitSwitch.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.techtammina.fitSwitch.dto.GymResponse;
import com.techtammina.fitSwitch.service.GymService;
import java.util.List;

@RestController
@RequestMapping("/gyms")
public class GymController {

    private final GymService gymService;
    
    public GymController(GymService gymService) {
        this.gymService = gymService;
    }

    @GetMapping
    public List<GymResponse> getAllGyms() {
        return gymService.getAllActiveGyms();
    }

    @GetMapping("/{gymId}")
    public GymResponse getGymById(@PathVariable Long gymId) {
        return gymService.getGymById(gymId);
    }
    
}
