package com.techtammina.fitSwitch.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.techtammina.fitSwitch.dto.GymCreateRequest;
import com.techtammina.fitSwitch.dto.GymResponse;
import com.techtammina.fitSwitch.dto.GymUpdateRequest;
import com.techtammina.fitSwitch.entity.Gym;
import com.techtammina.fitSwitch.repository.GymRepository;

@Service
public class GymService {

    private final GymRepository gymRepository;

    public GymService(GymRepository gymRepository) {
        this.gymRepository = gymRepository;
    }

    public GymResponse createGym(Long ownerId, GymCreateRequest request){
        
        Gym gym = Gym.builder()
                    .ownerId(ownerId)
                    .gymName(request.getGymName())
                    .address(request.getAddress())
                    .city(request.getCity())
                    .state(request.getState())
                    .pincode(request.getPincode())
                    .contactNumber(request.getContactNumber())
                    .latitude(request.getLatitude() != null ? request.getLatitude() : 0.0)
                    .longitude(request.getLongitude() != null ? request.getLongitude() : 0.0)
                    .openTime(request.getOpenTime())
                    .closeTime(request.getCloseTime())
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

        Gym saved = gymRepository.save(gym);

        return mapToResponse(saved);
    }

    public GymResponse updateGym(Long ownerId, Long gymId, GymUpdateRequest request) {

        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        // owner check
        if (!gym.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Access denied: Not your gym");
        }

        if (request.getGymName() != null) gym.setGymName(request.getGymName());
        if (request.getAddress() != null) gym.setAddress(request.getAddress());
        if (request.getCity() != null) gym.setCity(request.getCity());
        if (request.getState() != null) gym.setState(request.getState());
        if (request.getPincode() != null) gym.setPincode(request.getPincode());
        if (request.getContactNumber() != null) gym.setContactNumber(request.getContactNumber());
        if (request.getLatitude() != null) gym.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) gym.setLongitude(request.getLongitude());
        if (request.getOpenTime() != null) gym.setOpenTime(request.getOpenTime());
        if (request.getCloseTime() != null) gym.setCloseTime(request.getCloseTime());
        if (request.getActive() != null) gym.setActive(request.getActive());

        gym.setUpdatedAt(LocalDateTime.now());

        Gym updated = gymRepository.save(gym);

        return mapToResponse(updated);
    }

    public List<GymResponse> getAllActiveGyms(){
        return gymRepository.findByActiveTrue().stream()
        .map(this::mapToResponse)
        .toList();
    }

    public GymResponse getGymById(Long gymId) {
        Gym gym = gymRepository.findByIdAndActiveTrue(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        return mapToResponse(gym);
    }

    public List<GymResponse> getOwnerGyms(Long ownerId) {
        return gymRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private GymResponse mapToResponse(Gym gym) {
        return GymResponse.builder()
                .id(gym.getId())
                .gymName(gym.getGymName())
                .address(gym.getAddress())
                .city(gym.getCity())
                .state(gym.getState())
                .pincode(gym.getPincode())
                .contactNumber(gym.getContactNumber())
                .latitude(gym.getLatitude())
                .longitude(gym.getLongitude())
                .openTime(gym.getOpenTime())
                .closeTime(gym.getCloseTime())
                .active(gym.isActive())
                .build();
    }
    
}
