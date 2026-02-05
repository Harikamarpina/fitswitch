package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.dto.OwnerTodayVisitResponse;
import com.techtammina.fitSwitch.dto.UserSessionHistoryResponse;
import com.techtammina.fitSwitch.entity.GymMembershipSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GymMembershipSessionRepository extends JpaRepository<GymMembershipSession, Long> {

    Optional<GymMembershipSession> findByMembershipIdAndStatus(Long membershipId, GymMembershipSession.SessionStatus status);

    Optional<GymMembershipSession> findByMembershipIdAndVisitDateAndStatus(Long membershipId, LocalDate visitDate, GymMembershipSession.SessionStatus status);

    Optional<GymMembershipSession> findByUserIdAndMembershipIdAndStatus(Long userId, Long membershipId, GymMembershipSession.SessionStatus status);

    List<GymMembershipSession> findByUserIdAndStatus(Long userId, GymMembershipSession.SessionStatus status);

    @Query("SELECT COUNT(DISTINCT g.visitDate) FROM GymMembershipSession g WHERE g.userId = :userId AND g.status = 'COMPLETED'")
    int countCompletedVisitDaysByUserId(@Param("userId") Long userId);

    @Query("SELECT MAX(g.visitDate) FROM GymMembershipSession g WHERE g.userId = :userId AND g.status = 'COMPLETED'")
    Optional<LocalDate> findLastVisitDateByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(g) FROM GymMembershipSession g WHERE g.userId = :userId AND g.gymId = :gymId AND g.status = 'COMPLETED'")
    int countCompletedSessionsByUserAndGym(@Param("userId") Long userId, @Param("gymId") Long gymId);

    @Query("SELECT g FROM GymMembershipSession g WHERE g.userId = :userId AND g.gymId = :gymId ORDER BY g.checkInTime DESC")
    List<GymMembershipSession> findLatestSessionsByUserAndGym(@Param("userId") Long userId, @Param("gymId") Long gymId);

    @Query("SELECT DISTINCT g.userId FROM GymMembershipSession g WHERE g.gymId = :gymId")
    List<Long> findDistinctUserIdsByGymId(@Param("gymId") Long gymId);

    @Query("SELECT new com.techtammina.fitSwitch.dto.OwnerTodayVisitResponse(" +
           "u.id, u.fullName, u.email, g.checkInTime, g.checkOutTime, CAST(g.status AS string)) " +
           "FROM GymMembershipSession g " +
           "JOIN User u ON g.userId = u.id " +
           "WHERE g.gymId = :gymId AND g.visitDate = :today " +
           "ORDER BY g.checkInTime DESC")
    List<OwnerTodayVisitResponse> findTodayVisitsByGymId(@Param("gymId") Long gymId, @Param("today") LocalDate today);

    @Query("SELECT new com.techtammina.fitSwitch.dto.UserSessionHistoryResponse(" +
           "g.id, gym.gymName, g.visitDate, g.checkInTime, g.checkOutTime, CAST(g.status AS string)) " +
           "FROM GymMembershipSession g " +
           "JOIN Gym gym ON g.gymId = gym.id " +
           "WHERE g.userId = :userId ORDER BY g.visitDate DESC")
    List<UserSessionHistoryResponse> findSessionHistoryByUserId(@Param("userId") Long userId);

    @Query("SELECT new com.techtammina.fitSwitch.dto.UserSessionHistoryResponse(" +
           "g.id, gym.gymName, g.visitDate, g.checkInTime, g.checkOutTime, CAST(g.status AS string)) " +
           "FROM GymMembershipSession g " +
           "JOIN Gym gym ON g.gymId = gym.id " +
           "WHERE g.userId = :userId AND g.gymId = :gymId ORDER BY g.visitDate DESC")
    List<UserSessionHistoryResponse> findSessionHistoryByUserIdAndGymId(@Param("userId") Long userId, @Param("gymId") Long gymId);
}
