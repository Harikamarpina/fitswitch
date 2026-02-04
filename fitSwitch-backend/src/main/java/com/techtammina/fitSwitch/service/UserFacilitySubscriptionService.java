package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.FacilitySubscribeRequest;
import com.techtammina.fitSwitch.dto.UserFacilitySubscriptionResponse;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserFacilitySubscriptionService {

    private final UserFacilitySubscriptionRepository subscriptionRepository;
    private final FacilityPlanRepository facilityPlanRepository;
    private final GymFacilityRepository gymFacilityRepository;
    private final GymRepository gymRepository;
    private final UserWalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    public UserFacilitySubscriptionService(UserFacilitySubscriptionRepository subscriptionRepository,
                                          FacilityPlanRepository facilityPlanRepository,
                                          GymFacilityRepository gymFacilityRepository,
                                          GymRepository gymRepository,
                                          UserWalletRepository walletRepository,
                                          WalletTransactionRepository transactionRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.facilityPlanRepository = facilityPlanRepository;
        this.gymFacilityRepository = gymFacilityRepository;
        this.gymRepository = gymRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public UserFacilitySubscriptionResponse subscribeFacility(Long userId, FacilitySubscribeRequest request) {
        // Validate facility plan exists and is active
        FacilityPlan plan = facilityPlanRepository.findById(request.getFacilityPlanId())
                .orElseThrow(() -> new RuntimeException("Facility plan not found"));

        if (!plan.isActive()) {
            throw new RuntimeException("Facility plan is not active");
        }

        // Check wallet balance
        UserWallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Please add money to your wallet to subscribe"));
        
        if (wallet.getBalance().compareTo(plan.getPrice()) < 0) {
            throw new RuntimeException("Insufficient wallet balance. Please add money to your wallet to subscribe");
        }

        // Check if user already has active subscription for this facility
        subscriptionRepository.findByUserIdAndFacilityIdAndStatus(
                userId, plan.getFacilityId(), FacilitySubscriptionStatus.ACTIVE)
                .ifPresent(existing -> {
                    throw new RuntimeException("Active facility subscription already exists");
                });

        // Deduct money from wallet
        BigDecimal newBalance = wallet.getBalance().subtract(plan.getPrice());
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        // Create wallet transaction
        WalletTransaction transaction = new WalletTransaction();
        transaction.setUserId(userId);
        transaction.setWalletId(wallet.getId());
        transaction.setType(WalletTransaction.TransactionType.SUB);
        transaction.setAmount(plan.getPrice().negate());
        transaction.setBalanceAfter(newBalance);
        transaction.setDescription("Facility plan subscription: " + plan.getPlanName());
        transaction.setFacilityId(plan.getFacilityId());
        transaction.setGymId(plan.getGymId());
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        // Create subscription
        UserFacilitySubscription subscription = new UserFacilitySubscription();
        subscription.setUserId(userId);
        subscription.setGymId(plan.getGymId());
        subscription.setFacilityId(plan.getFacilityId());
        subscription.setFacilityPlanId(plan.getId());
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
        subscription.setStatus(FacilitySubscriptionStatus.ACTIVE);
        subscription.setCreatedAt(LocalDateTime.now());

        UserFacilitySubscription saved = subscriptionRepository.save(subscription);

        // Credit owner wallet with facility plan purchase
        Gym gymForOwner = gymRepository.findById(plan.getGymId()).orElse(null);
        if (gymForOwner != null) {
            UserWallet ownerWallet = walletRepository.findByUserId(gymForOwner.getOwnerId())
                    .orElseGet(() -> createWallet(gymForOwner.getOwnerId()));
            ownerWallet.setBalance(ownerWallet.getBalance().add(plan.getPrice()));
            UserWallet savedOwnerWallet = walletRepository.save(ownerWallet);

            WalletTransaction ownerWalletTxn = new WalletTransaction();
            ownerWalletTxn.setUserId(gymForOwner.getOwnerId());
            ownerWalletTxn.setWalletId(savedOwnerWallet.getId());
            ownerWalletTxn.setType(WalletTransaction.TransactionType.OWNER_EARNING);
            ownerWalletTxn.setAmount(plan.getPrice());
            ownerWalletTxn.setBalanceAfter(savedOwnerWallet.getBalance());
            ownerWalletTxn.setDescription("Owner earning: facility plan purchase");
            ownerWalletTxn.setGymId(plan.getGymId());
            ownerWalletTxn.setFacilityId(plan.getFacilityId());
            ownerWalletTxn.setCreatedAt(LocalDateTime.now());
            transactionRepository.save(ownerWalletTxn);
        }

        // Get related entities for response
        Gym gym = gymRepository.findById(plan.getGymId()).orElse(null);
        GymFacility facility = gymFacilityRepository.findById(plan.getFacilityId()).orElse(null);

        return mapToResponse(saved, gym, facility, plan);
    }

    public List<UserFacilitySubscriptionResponse> getUserFacilitySubscriptions(Long userId) {
        List<UserFacilitySubscription> subscriptions = subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);

        // Auto-expire subscriptions
        LocalDate today = LocalDate.now();
        subscriptions.forEach(subscription -> {
            if (subscription.getStatus() == FacilitySubscriptionStatus.ACTIVE &&
                subscription.getEndDate().isBefore(today)) {
                subscription.setStatus(FacilitySubscriptionStatus.EXPIRED);
                subscriptionRepository.save(subscription);
            }
        });

        return subscriptions.stream()
                .map(subscription -> {
                    FacilityPlan plan = facilityPlanRepository.findById(subscription.getFacilityPlanId()).orElse(null);
                    Gym gym = gymRepository.findById(subscription.getGymId()).orElse(null);
                    GymFacility facility = gymFacilityRepository.findById(subscription.getFacilityId()).orElse(null);
                    return mapToResponse(subscription, gym, facility, plan);
                })
                .toList();
    }

    private UserFacilitySubscriptionResponse mapToResponse(UserFacilitySubscription subscription, 
                                                          Gym gym, GymFacility facility, FacilityPlan plan) {
        UserFacilitySubscriptionResponse response = new UserFacilitySubscriptionResponse();
        response.setId(subscription.getId());
        response.setGymName(gym != null ? gym.getGymName() : "Unknown Gym");
        response.setFacilityName(facility != null ? facility.getFacilityName() : "Unknown Facility");
        response.setPlanName(plan != null ? plan.getPlanName() : "Unknown Plan");
        response.setStartDate(subscription.getStartDate());
        response.setEndDate(subscription.getEndDate());
        response.setStatus(subscription.getStatus());
        response.setPrice(plan != null ? plan.getPrice() : null);
        response.setDurationDays(plan != null ? plan.getDurationDays() : null);
        return response;
    }

    private UserWallet createWallet(Long userId) {
        UserWallet wallet = new UserWallet(userId, BigDecimal.ZERO);
        return walletRepository.save(wallet);
    }
}
