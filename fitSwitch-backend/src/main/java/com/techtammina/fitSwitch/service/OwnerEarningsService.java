package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.ApiResponse;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OwnerEarningsService {

    private final OwnerEarningRepository ownerEarningRepository;
    private final GymRepository gymRepository;
    private final GymFacilityRepository facilityRepository;
    private final UserRepository userRepository;

    public OwnerEarningsService(OwnerEarningRepository ownerEarningRepository,
                              GymRepository gymRepository,
                              GymFacilityRepository facilityRepository,
                              UserRepository userRepository) {
        this.ownerEarningRepository = ownerEarningRepository;
        this.gymRepository = gymRepository;
        this.facilityRepository = facilityRepository;
        this.userRepository = userRepository;
    }

    public List<OwnerEarningResponse> getOwnerEarnings(Long ownerId) {
        List<OwnerEarning> earnings = ownerEarningRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
        
        return earnings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OwnerEarningResponse> getGymEarnings(Long ownerId, Long gymId) {
        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        List<OwnerEarning> earnings = ownerEarningRepository.findByGymIdOrderByCreatedAtDesc(gymId);
        
        return earnings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BigDecimal getTotalEarnings(Long ownerId) {
        return ownerEarningRepository.getTotalEarningsByOwnerId(ownerId);
    }

    public BigDecimal getGymTotalEarnings(Long ownerId, Long gymId) {
        // Verify gym belongs to owner
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        return ownerEarningRepository.getTotalEarningsByGymId(gymId);
    }

    private OwnerEarningResponse mapToResponse(OwnerEarning earning) {
        OwnerEarningResponse response = new OwnerEarningResponse();
        response.setId(earning.getId());
        response.setType(earning.getType());
        response.setAmount(earning.getAmount());
        response.setDescription(earning.getDescription());
        response.setCreatedAt(earning.getCreatedAt());

        // Add gym name
        if (earning.getGymId() != null) {
            gymRepository.findById(earning.getGymId())
                    .ifPresent(gym -> response.setGymName(gym.getGymName()));
        }

        // Add facility name
        if (earning.getFacilityId() != null) {
            facilityRepository.findById(earning.getFacilityId())
                    .ifPresent(facility -> response.setFacilityName(facility.getFacilityName()));
        }

        // Add user name
        if (earning.getUserId() != null) {
            userRepository.findById(earning.getUserId())
                    .ifPresent(user -> response.setUserName(user.getFullName()));
        }

        return response;
    }

    // DTO class for response
    public static class OwnerEarningResponse {
        private Long id;
        private OwnerEarning.EarningType type;
        private BigDecimal amount;
        private String description;
        private String gymName;
        private String facilityName;
        private String userName;
        private LocalDateTime createdAt;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public OwnerEarning.EarningType getType() { return type; }
        public void setType(OwnerEarning.EarningType type) { this.type = type; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getGymName() { return gymName; }
        public void setGymName(String gymName) { this.gymName = gymName; }

        public String getFacilityName() { return facilityName; }
        public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}