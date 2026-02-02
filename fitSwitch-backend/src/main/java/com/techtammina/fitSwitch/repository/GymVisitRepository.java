package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.entity.GymVisit;
import com.techtammina.fitSwitch.entity.GymVisitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface GymVisitRepository extends JpaRepository<GymVisit, Long> {

    Optional<GymVisit> findByUserIdAndGymIdAndVisitDateAndStatus(
            Long userId, Long gymId, LocalDate visitDate, GymVisitStatus status);

    Optional<GymVisit> findByUserIdAndStatus(Long userId, GymVisitStatus status);
}