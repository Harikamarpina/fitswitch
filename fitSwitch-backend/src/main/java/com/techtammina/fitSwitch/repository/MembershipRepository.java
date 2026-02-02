package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.entity.Membership;
import com.techtammina.fitSwitch.entity.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    List<Membership> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Membership> findByUserIdAndGymIdAndStatus(Long userId, Long gymId, MembershipStatus status);
}