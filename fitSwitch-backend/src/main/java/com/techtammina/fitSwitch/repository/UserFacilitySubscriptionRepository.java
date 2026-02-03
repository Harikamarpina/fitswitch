package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.dto.OwnerGymMemberResponse;
import com.techtammina.fitSwitch.dto.UserFacilityHistoryResponse;
import com.techtammina.fitSwitch.entity.FacilitySubscriptionStatus;
import com.techtammina.fitSwitch.entity.UserFacilitySubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserFacilitySubscriptionRepository extends JpaRepository<UserFacilitySubscription, Long> {

    List<UserFacilitySubscription> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<UserFacilitySubscription> findByUserIdAndFacilityIdAndStatus(
            Long userId, Long facilityId, FacilitySubscriptionStatus status);
            
    Optional<UserFacilitySubscription> findByUserIdAndGymIdAndStatus(
            Long userId, Long gymId, FacilitySubscriptionStatus status);
            
    List<UserFacilitySubscription> findByUserIdAndStatus(Long userId, FacilitySubscriptionStatus status);
    
    List<UserFacilitySubscription> findByUserIdAndGymId(Long userId, Long gymId);
    
    List<UserFacilitySubscription> findByFacilityIdAndFacilityPlanId(Long facilityId, Long facilityPlanId);
    
    @Query("SELECT new com.techtammina.fitSwitch.dto.OwnerGymMemberResponse(" +
           "u.id, u.fullName, u.email, fp.planName, 'FACILITY', ufs.startDate, ufs.endDate, " +
           "CAST(ufs.status AS string), " +
           "(SELECT MAX(gs.visitDate) FROM GymSession gs WHERE gs.userId = u.id AND gs.gymId = :gymId AND gs.status = 'COMPLETED')) " +
           "FROM UserFacilitySubscription ufs " +
           "JOIN User u ON ufs.userId = u.id " +
           "JOIN FacilityPlan fp ON ufs.facilityPlanId = fp.id " +
           "WHERE ufs.gymId = :gymId AND ufs.status = 'ACTIVE'")
    List<OwnerGymMemberResponse> findActiveFacilitySubscribers(@Param("gymId") Long gymId);
    
    @Query("SELECT ufs.id FROM UserFacilitySubscription ufs WHERE ufs.gymId = :gymId AND ufs.status = 'ACTIVE' AND ufs.endDate < :today")
    List<Long> findExpiredSubscriptionIdsByGym(@Param("gymId") Long gymId, @Param("today") LocalDate today);
    
    @Modifying
    @Transactional
    @Query("UPDATE UserFacilitySubscription ufs SET ufs.status = :status WHERE ufs.id IN :subscriptionIds")
    void updateSubscriptionsToExpired(@Param("subscriptionIds") List<Long> subscriptionIds, 
                                     @Param("status") FacilitySubscriptionStatus status);
    
    List<UserFacilitySubscription> findByGymIdAndStatusAndEndDateBetween(
            Long gymId, FacilitySubscriptionStatus status, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT ufs.id FROM UserFacilitySubscription ufs WHERE ufs.userId = :userId AND ufs.status = 'ACTIVE' AND ufs.endDate < :today")
    List<Long> findExpiredSubscriptionIds(@Param("userId") Long userId, @Param("today") LocalDate today);
    
    @Query("SELECT new com.techtammina.fitSwitch.dto.UserFacilityHistoryResponse(" +
           "ufs.id, g.gymName, gf.facilityName, fp.planName, ufs.startDate, ufs.endDate, ufs.status, fp.price, fp.durationDays) " +
           "FROM UserFacilitySubscription ufs " +
           "JOIN Gym g ON ufs.gymId = g.id " +
           "JOIN GymFacility gf ON ufs.facilityId = gf.id " +
           "JOIN FacilityPlan fp ON ufs.facilityPlanId = fp.id " +
           "WHERE ufs.userId = :userId ORDER BY ufs.createdAt DESC")
    List<UserFacilityHistoryResponse> findFacilityHistoryByUserId(@Param("userId") Long userId);
}