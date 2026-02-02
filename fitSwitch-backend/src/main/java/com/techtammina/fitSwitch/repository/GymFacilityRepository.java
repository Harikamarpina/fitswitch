package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.entity.GymFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GymFacilityRepository extends JpaRepository<GymFacility, Long> {
    
    List<GymFacility> findByGymIdAndActiveTrue(Long gymId);
    
    List<GymFacility> findByGymId(Long gymId);
}