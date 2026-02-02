package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.entity.FacilityPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityPlanRepository extends JpaRepository<FacilityPlan, Long> {

    List<FacilityPlan> findByFacilityIdAndActiveTrue(Long facilityId);

    List<FacilityPlan> findByFacilityId(Long facilityId);
}