package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.entity.FacilitySubscriptionStatus;
import com.techtammina.fitSwitch.entity.UserFacilitySubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFacilitySubscriptionRepository extends JpaRepository<UserFacilitySubscription, Long> {

    List<UserFacilitySubscription> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<UserFacilitySubscription> findByUserIdAndFacilityIdAndStatus(
            Long userId, Long facilityId, FacilitySubscriptionStatus status);
}