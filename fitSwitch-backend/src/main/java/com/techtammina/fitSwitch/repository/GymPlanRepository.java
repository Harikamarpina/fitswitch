package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.entity.GymPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GymPlanRepository extends JpaRepository<GymPlan, Long> {

    List<GymPlan> findByGymId(Long gymId);

    List<GymPlan> findByGymIdAndActiveTrue(Long gymId);
}
