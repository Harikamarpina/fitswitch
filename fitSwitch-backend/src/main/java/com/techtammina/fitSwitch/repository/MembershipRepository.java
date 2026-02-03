package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.dto.UserMembershipHistoryResponse;
import com.techtammina.fitSwitch.dto.OwnerGymMemberResponse;
import com.techtammina.fitSwitch.entity.Membership;
import com.techtammina.fitSwitch.entity.MembershipStatus;
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
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    List<Membership> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Membership> findByUserIdAndGymIdAndStatus(Long userId, Long gymId, MembershipStatus status);
    
    List<Membership> findByUserIdAndStatus(Long userId, MembershipStatus status);
    
    List<Membership> findByUserIdAndGymId(Long userId, Long gymId);
    
    List<Membership> findByGymIdAndPlanId(Long gymId, Long planId);
    
    @Query("SELECT new com.techtammina.fitSwitch.dto.OwnerGymMemberResponse(" +
           "u.id, u.fullName, u.email, gp.planName, 'GYM', m.startDate, m.endDate, " +
           "CAST(m.status AS string), " +
           "(SELECT MAX(gs.visitDate) FROM GymSession gs WHERE gs.userId = u.id AND gs.gymId = :gymId AND gs.status = 'COMPLETED')) " +
           "FROM Membership m " +
           "JOIN User u ON m.userId = u.id " +
           "JOIN GymPlan gp ON m.planId = gp.id " +
           "WHERE m.gymId = :gymId AND m.status = 'ACTIVE'")
    List<OwnerGymMemberResponse> findActiveGymMembers(@Param("gymId") Long gymId);
    
    @Query("SELECT new com.techtammina.fitSwitch.dto.OwnerGymMemberResponse(" +
           "u.id, u.fullName, u.email, gp.planName, 'GYM', m.startDate, m.endDate, " +
           "CAST(m.status AS string), " +
           "(SELECT MAX(gs.visitDate) FROM GymSession gs WHERE gs.userId = u.id AND gs.gymId = :gymId AND gs.status = 'COMPLETED')) " +
           "FROM Membership m " +
           "JOIN User u ON m.userId = u.id " +
           "JOIN GymPlan gp ON m.planId = gp.id " +
           "WHERE m.gymId = :gymId AND m.status = 'ACTIVE' AND m.endDate BETWEEN :startDate AND :endDate")
    List<OwnerGymMemberResponse> findExpiringSoonMembers(@Param("gymId") Long gymId, 
                                                        @Param("startDate") LocalDate startDate, 
                                                        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT m.id FROM Membership m WHERE m.gymId = :gymId AND m.status = 'ACTIVE' AND m.endDate < :today")
    List<Long> findExpiredMembershipIdsByGym(@Param("gymId") Long gymId, @Param("today") LocalDate today);
    
    @Modifying
    @Transactional
    @Query("UPDATE Membership m SET m.status = :status WHERE m.id IN :membershipIds")
    void updateMembershipsToExpired(@Param("membershipIds") List<Long> membershipIds, 
                                   @Param("status") MembershipStatus status);
}