package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.ActiveMembershipSessionResponse;
import com.techtammina.fitSwitch.dto.MembershipSessionResponse;
import com.techtammina.fitSwitch.entity.GymMembershipSession;
import com.techtammina.fitSwitch.entity.Membership;
import com.techtammina.fitSwitch.entity.MembershipStatus;
import com.techtammina.fitSwitch.repository.GymPlanRepository;
import com.techtammina.fitSwitch.repository.GymRepository;
import com.techtammina.fitSwitch.repository.GymMembershipSessionRepository;
import com.techtammina.fitSwitch.repository.MembershipRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MembershipSessionService {

    private final GymMembershipSessionRepository sessionRepository;
    private final MembershipRepository membershipRepository;
    private final GymRepository gymRepository;
    private final GymPlanRepository gymPlanRepository;

    public MembershipSessionService(GymMembershipSessionRepository sessionRepository,
                                    MembershipRepository membershipRepository,
                                    GymRepository gymRepository,
                                    GymPlanRepository gymPlanRepository) {
        this.sessionRepository = sessionRepository;
        this.membershipRepository = membershipRepository;
        this.gymRepository = gymRepository;
        this.gymPlanRepository = gymPlanRepository;
    }

    public MembershipSessionResponse checkIn(Long userId, Long membershipId) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        if (!membership.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to membership");
        }

        if (membership.getStatus() != MembershipStatus.ACTIVE) {
            throw new RuntimeException("Membership is not active");
        }

        LocalDate today = LocalDate.now();
        Optional<GymMembershipSession> existing = sessionRepository
                .findByMembershipIdAndVisitDateAndStatus(membershipId, today, GymMembershipSession.SessionStatus.ACTIVE);
        if (existing.isPresent()) {
            throw new RuntimeException("You already have an active session for this membership today");
        }

        GymMembershipSession session = new GymMembershipSession();
        session.setUserId(userId);
        session.setGymId(membership.getGymId());
        session.setMembershipId(membershipId);
        session.setCheckInTime(LocalDateTime.now());
        session.setVisitDate(today);
        session.setStatus(GymMembershipSession.SessionStatus.ACTIVE);

        GymMembershipSession saved = sessionRepository.save(session);
        return mapToResponse(saved, "Check-in successful");
    }

    public MembershipSessionResponse checkOut(Long userId, Long membershipId) {
        GymMembershipSession session = sessionRepository
                .findByUserIdAndMembershipIdAndStatus(userId, membershipId, GymMembershipSession.SessionStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active session found for this membership"));

        session.setCheckOutTime(LocalDateTime.now());
        session.setStatus(GymMembershipSession.SessionStatus.COMPLETED);
        GymMembershipSession updated = sessionRepository.save(session);
        return mapToResponse(updated, "Check-out successful");
    }

    public MembershipSessionResponse getCurrent(Long userId, Long membershipId) {
        Optional<GymMembershipSession> session = sessionRepository
                .findByUserIdAndMembershipIdAndStatus(userId, membershipId, GymMembershipSession.SessionStatus.ACTIVE);
        if (session.isEmpty()) {
            MembershipSessionResponse response = new MembershipSessionResponse();
            response.setMembershipId(membershipId);
            response.setStatus("NONE");
            return response;
        }
        return mapToResponse(session.get(), "Active session");
    }

    public List<ActiveMembershipSessionResponse> getActiveSessions(Long userId) {
        return sessionRepository.findByUserIdAndStatus(userId, GymMembershipSession.SessionStatus.ACTIVE)
                .stream()
                .map(this::mapToActiveResponse)
                .toList();
    }

    private MembershipSessionResponse mapToResponse(GymMembershipSession session, String message) {
        MembershipSessionResponse response = new MembershipSessionResponse();
        response.setSessionId(session.getId());
        response.setMembershipId(session.getMembershipId());
        response.setGymId(session.getGymId());
        response.setStatus(session.getStatus().toString());
        response.setCheckInTime(session.getCheckInTime());
        response.setCheckOutTime(session.getCheckOutTime());
        response.setMessage(message);
        return response;
    }

    private ActiveMembershipSessionResponse mapToActiveResponse(GymMembershipSession session) {
        ActiveMembershipSessionResponse response = new ActiveMembershipSessionResponse();
        response.setSessionId(session.getId());
        response.setMembershipId(session.getMembershipId());
        response.setGymId(session.getGymId());
        response.setCheckInTime(session.getCheckInTime());

        gymRepository.findById(session.getGymId())
                .ifPresent(gym -> response.setGymName(gym.getGymName()));
        membershipRepository.findById(session.getMembershipId())
                .ifPresent(membership -> gymPlanRepository.findById(membership.getPlanId())
                        .ifPresent(plan -> response.setPlanName(plan.getPlanName())));

        return response;
    }
}
