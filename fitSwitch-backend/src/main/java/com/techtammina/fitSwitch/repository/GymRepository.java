package com.techtammina.fitSwitch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techtammina.fitSwitch.entity.Gym;

public interface GymRepository extends JpaRepository<Gym, Long> {
    List<Gym> findByActiveTrue();

    List<Gym> findByOwnerId(Long ownerId);

    Optional<Gym>findByIdAndActiveTrue(Long gymId);
}
