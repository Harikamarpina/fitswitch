package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.entity.GymSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GymSessionRepository extends JpaRepository<GymSession, Long> {
    
    Optional<GymSession> findByUserIdAndGymIdAndVisitDateAndStatus(
        Long userId, Long gymId, LocalDate visitDate, GymSession.SessionStatus status);
    
    Optional<GymSession> findByUserIdAndStatus(Long userId, GymSession.SessionStatus status);
    
    @Query("SELECT COUNT(DISTINCT g.visitDate) FROM GymSession g WHERE g.userId = :userId AND g.status = 'COMPLETED'")
    int countCompletedVisitDaysByUserId(@Param("userId") Long userId);
    
    @Query("SELECT MAX(g.visitDate) FROM GymSession g WHERE g.userId = :userId AND g.status = 'COMPLETED'")
    Optional<LocalDate> findLastVisitDateByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(g) FROM GymSession g WHERE g.userId = :userId AND g.gymId = :gymId AND g.status = 'COMPLETED'")
    int countCompletedSessionsByUserAndGym(@Param("userId") Long userId, @Param("gymId") Long gymId);
    
    @Query("SELECT g FROM GymSession g WHERE g.userId = :userId AND g.gymId = :gymId ORDER BY g.checkInTime DESC")
    List<GymSession> findLatestSessionsByUserAndGym(@Param("userId") Long userId, @Param("gymId") Long gymId);
    
    @Query("SELECT DISTINCT g.userId FROM GymSession g WHERE g.gymId = :gymId")
    List<Long> findDistinctUserIdsByGymId(@Param("gymId") Long gymId);
}