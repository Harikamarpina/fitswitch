package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.entity.FacilitySession;
import com.techtammina.fitSwitch.dto.FacilitySessionHistoryResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface FacilitySessionRepository extends JpaRepository<FacilitySession, Long> {

    Optional<FacilitySession> findByFacilitySubscriptionIdAndStatus(Long facilitySubscriptionId, FacilitySession.SessionStatus status);

    Optional<FacilitySession> findByFacilitySubscriptionIdAndVisitDateAndStatus(
            Long facilitySubscriptionId, LocalDate visitDate, FacilitySession.SessionStatus status);

    Optional<FacilitySession> findFirstByFacilitySubscriptionIdAndVisitDateOrderByCheckInTimeDesc(
            Long facilitySubscriptionId, LocalDate visitDate);

    Optional<FacilitySession> findByUserIdAndFacilitySubscriptionIdAndStatus(
            Long userId, Long facilitySubscriptionId, FacilitySession.SessionStatus status);

    java.util.List<FacilitySession> findByUserIdAndStatus(Long userId, FacilitySession.SessionStatus status);

    @Query("SELECT new com.techtammina.fitSwitch.dto.FacilitySessionHistoryResponse(" +
           "fs.id, g.gymName, gf.facilityName, fs.visitDate, fs.checkInTime, fs.checkOutTime, CAST(fs.status AS string)) " +
           "FROM FacilitySession fs " +
           "JOIN Gym g ON fs.gymId = g.id " +
           "JOIN GymFacility gf ON fs.facilityId = gf.id " +
           "WHERE fs.userId = :userId ORDER BY fs.visitDate DESC")
    java.util.List<FacilitySessionHistoryResponse> findFacilitySessionHistoryByUserId(@Param("userId") Long userId);
}
