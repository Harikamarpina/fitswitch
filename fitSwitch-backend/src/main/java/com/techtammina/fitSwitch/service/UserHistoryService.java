package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.UserMembershipHistoryResponse;
import com.techtammina.fitSwitch.dto.UserFacilityHistoryResponse;
import com.techtammina.fitSwitch.dto.UserSessionHistoryResponse;
import com.techtammina.fitSwitch.dto.FacilitySessionHistoryResponse;
import com.techtammina.fitSwitch.entity.MembershipStatus;
import com.techtammina.fitSwitch.entity.FacilitySubscriptionStatus;
import com.techtammina.fitSwitch.repository.MembershipRepository;
import com.techtammina.fitSwitch.repository.UserFacilitySubscriptionRepository;
import com.techtammina.fitSwitch.repository.GymMembershipSessionRepository;
import com.techtammina.fitSwitch.repository.FacilitySessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserHistoryService {

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private UserFacilitySubscriptionRepository facilitySubscriptionRepository;

    @Autowired
    private GymMembershipSessionRepository gymSessionRepository;

    @Autowired
    private FacilitySessionRepository facilitySessionRepository;

    public List<UserMembershipHistoryResponse> getMembershipHistory(Long userId) {
        // Update expired memberships before fetching
        updateExpiredMemberships(userId);
        
        return membershipRepository.findMembershipHistoryByUserId(userId);
    }

    public List<UserFacilityHistoryResponse> getFacilityHistory(Long userId) {
        // Update expired facility subscriptions before fetching
        updateExpiredFacilitySubscriptions(userId);
        
        return facilitySubscriptionRepository.findFacilityHistoryByUserId(userId);
    }

    public List<UserSessionHistoryResponse> getSessionHistory(Long userId) {
        return gymSessionRepository.findSessionHistoryByUserId(userId);
    }

    public List<FacilitySessionHistoryResponse> getFacilitySessionHistory(Long userId) {
        return facilitySessionRepository.findFacilitySessionHistoryByUserId(userId);
    }

    private void updateExpiredMemberships(Long userId) {
        LocalDate today = LocalDate.now();
        List<Long> expiredIds = membershipRepository.findExpiredMembershipIds(userId, today);
        if (!expiredIds.isEmpty()) {
            membershipRepository.updateMembershipsToExpired(expiredIds, MembershipStatus.EXPIRED);
        }
    }

    private void updateExpiredFacilitySubscriptions(Long userId) {
        LocalDate today = LocalDate.now();
        List<Long> expiredIds = facilitySubscriptionRepository.findExpiredSubscriptionIds(userId, today);
        if (!expiredIds.isEmpty()) {
            facilitySubscriptionRepository.updateSubscriptionsToExpired(expiredIds, FacilitySubscriptionStatus.EXPIRED);
        }
    }
}
