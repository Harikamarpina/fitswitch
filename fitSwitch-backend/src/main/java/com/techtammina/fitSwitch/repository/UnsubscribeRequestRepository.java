package com.techtammina.fitSwitch.repository;

import com.techtammina.fitSwitch.entity.UnsubscribeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnsubscribeRequestRepository extends JpaRepository<UnsubscribeRequest, Long> {
    
    List<UnsubscribeRequest> findByOwnerIdOrderByRequestDateDesc(Long ownerId);
    
    List<UnsubscribeRequest> findByUserIdOrderByRequestDateDesc(Long userId);
    
    Optional<UnsubscribeRequest> findByMembershipIdAndStatus(Long membershipId, UnsubscribeRequest.RequestStatus status);
    
    List<UnsubscribeRequest> findByOwnerIdAndStatusOrderByRequestDateDesc(Long ownerId, UnsubscribeRequest.RequestStatus status);
}