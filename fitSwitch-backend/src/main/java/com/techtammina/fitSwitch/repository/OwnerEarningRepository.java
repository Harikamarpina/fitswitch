package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.entity.OwnerEarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OwnerEarningRepository extends JpaRepository<OwnerEarning, Long> {
    List<OwnerEarning> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<OwnerEarning> findByGymIdOrderByCreatedAtDesc(Long gymId);
    
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM OwnerEarning e WHERE e.ownerId = :ownerId")
    BigDecimal getTotalEarningsByOwnerId(@Param("ownerId") Long ownerId);
    
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM OwnerEarning e WHERE e.gymId = :gymId")
    BigDecimal getTotalEarningsByGymId(@Param("gymId") Long gymId);
}