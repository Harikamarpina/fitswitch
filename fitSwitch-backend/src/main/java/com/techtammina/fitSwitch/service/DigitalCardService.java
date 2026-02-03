package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.ApiResponse;
import com.techtammina.fitSwitch.dto.GymSessionResponse;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class DigitalCardService {

    private final GymSessionRepository gymSessionRepository;
    private final MembershipRepository membershipRepository;
    private final UserFacilitySubscriptionRepository facilitySubscriptionRepository;
    private final UserWalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final OwnerEarningRepository ownerEarningRepository;
    private final GymRepository gymRepository;
    private final GymFacilityRepository facilityRepository;

    public DigitalCardService(GymSessionRepository gymSessionRepository,
                            MembershipRepository membershipRepository,
                            UserFacilitySubscriptionRepository facilitySubscriptionRepository,
                            UserWalletRepository walletRepository,
                            WalletTransactionRepository transactionRepository,
                            OwnerEarningRepository ownerEarningRepository,
                            GymRepository gymRepository,
                            GymFacilityRepository facilityRepository) {
        this.gymSessionRepository = gymSessionRepository;
        this.membershipRepository = membershipRepository;
        this.facilitySubscriptionRepository = facilitySubscriptionRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.ownerEarningRepository = ownerEarningRepository;
        this.gymRepository = gymRepository;
        this.facilityRepository = facilityRepository;
    }

    @Transactional
    public GymSessionResponse checkInWithDigitalCard(Long userId, Long gymId, Long facilityId) {
        LocalDate today = LocalDate.now();
        
        // Check if user already has an active session today for this gym
        Optional<GymSession> existingSession = gymSessionRepository
            .findByUserIdAndGymIdAndVisitDateAndStatus(userId, gymId, today, GymSession.SessionStatus.ACTIVE);
        
        if (existingSession.isPresent()) {
            throw new RuntimeException("You already have an active session for this gym today");
        }

        // Check if user has active membership or subscription for this gym
        boolean hasActiveMembership = membershipRepository
            .findByUserIdAndGymIdAndStatus(userId, gymId, MembershipStatus.ACTIVE).isPresent();
        
        boolean hasActiveFacilitySubscription = facilitySubscriptionRepository
            .findByUserIdAndGymIdAndStatus(userId, gymId, FacilitySubscriptionStatus.ACTIVE).isPresent();

        if (hasActiveMembership || hasActiveFacilitySubscription) {
            // User has existing access, use regular check-in
            throw new RuntimeException("You have active membership/subscription. Use regular check-in");
        }

        // Process wallet payment for facility usage
        processWalletPayment(userId, gymId, facilityId);

        // Create session for digital card usage
        GymSession session = new GymSession();
        session.setUserId(userId);
        session.setGymId(gymId);
        session.setCheckInTime(LocalDateTime.now());
        session.setVisitDate(today);
        session.setStatus(GymSession.SessionStatus.ACTIVE);

        GymSession savedSession = gymSessionRepository.save(session);
        
        return mapToResponse(savedSession, "Digital card check-in successful");
    }

    private void processWalletPayment(Long userId, Long gymId, Long facilityId) {
        // Get user wallet
        UserWallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found. Please add money to your wallet first"));

        // Get gym and facility details
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        GymFacility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        // Validate facility belongs to gym
        if (!facility.getGymId().equals(gymId)) {
            throw new RuntimeException("Facility does not belong to the selected gym");
        }

        // Calculate facility usage cost
        BigDecimal usageCost = new BigDecimal("50.00"); // Fixed cost for now

        // Check wallet balance
        if (wallet.getBalance().compareTo(usageCost) < 0) {
            throw new RuntimeException("Insufficient wallet balance. Please add money to your wallet");
        }

        // Debit wallet
        BigDecimal newBalance = wallet.getBalance().subtract(usageCost);
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        // Create wallet transaction
        WalletTransaction transaction = new WalletTransaction();
        transaction.setUserId(userId);
        transaction.setWalletId(wallet.getId());
        transaction.setType(WalletTransaction.TransactionType.FACILITY_USAGE);
        transaction.setAmount(usageCost.negate()); // Negative for debit
        transaction.setBalanceAfter(newBalance);
        transaction.setDescription("Digital card usage: " + facility.getFacilityName() + " at " + gym.getGymName());
        transaction.setGymId(gymId);
        transaction.setFacilityId(facilityId);
        transaction.setCreatedAt(LocalDateTime.now());
        WalletTransaction savedTransaction = transactionRepository.save(transaction);

        // Credit gym owner
        OwnerEarning earning = new OwnerEarning();
        earning.setOwnerId(gym.getOwnerId());
        earning.setGymId(gymId);
        earning.setUserId(userId);
        earning.setType(OwnerEarning.EarningType.FACILITY_USAGE);
        earning.setAmount(usageCost);
        earning.setDescription("Digital card payment: " + facility.getFacilityName());
        earning.setFacilityId(facilityId);
        earning.setTransactionId(savedTransaction.getId());
        earning.setCreatedAt(LocalDateTime.now());
        ownerEarningRepository.save(earning);
    }

    private GymSessionResponse mapToResponse(GymSession session, String message) {
        GymSessionResponse response = new GymSessionResponse();
        response.setSessionId(session.getId());
        response.setGymId(session.getGymId());
        response.setCheckInTime(session.getCheckInTime());
        response.setCheckOutTime(session.getCheckOutTime());
        response.setStatus(session.getStatus().toString());
        response.setMessage(message);
        
        // Get gym name
        gymRepository.findById(session.getGymId())
            .ifPresent(gym -> response.setGymName(gym.getGymName()));
        
        return response;
    }
}