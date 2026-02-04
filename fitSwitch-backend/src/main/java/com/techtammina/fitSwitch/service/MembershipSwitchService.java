package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.*;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class MembershipSwitchService {

    private final MembershipRepository membershipRepository;
    private final GymRepository gymRepository;
    private final GymPlanRepository planRepository;
    private final UserWalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final OwnerEarningRepository ownerEarningRepository;
    private final EmailService emailService;

    public MembershipSwitchService(MembershipRepository membershipRepository,
                                 GymRepository gymRepository,
                                 GymPlanRepository planRepository,
                                 UserWalletRepository walletRepository,
                                 WalletTransactionRepository transactionRepository,
                                 OwnerEarningRepository ownerEarningRepository,
                                 EmailService emailService) {
        this.membershipRepository = membershipRepository;
        this.gymRepository = gymRepository;
        this.planRepository = planRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.ownerEarningRepository = ownerEarningRepository;
        this.emailService = emailService;
    }

    @Transactional
    public ApiResponse switchMembership(Long userId, MembershipSwitchRequest request) {
        // Get current membership
        Membership currentMembership = membershipRepository.findById(request.getCurrentMembershipId())
                .orElseThrow(() -> new RuntimeException("Current membership not found"));

        // Validate ownership
        if (!currentMembership.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to membership");
        }

        // Validate current membership is active
        if (currentMembership.getStatus() != MembershipStatus.ACTIVE) {
            throw new RuntimeException("Current membership is not active");
        }

        // Get current plan to check pass type
        GymPlan currentPlan = planRepository.findById(currentMembership.getPlanId())
                .orElseThrow(() -> new RuntimeException("Current plan not found"));

        // Check pass type restrictions
        if (currentPlan.getPassType() == com.techtammina.fitSwitch.enums.PassType.REGULAR) {
            throw new RuntimeException("Regular pass holders cannot switch gyms");
        }

        // Get current gym
        Gym currentGym = gymRepository.findById(currentMembership.getGymId())
                .orElseThrow(() -> new RuntimeException("Current gym not found"));

        // Get new gym and plan
        Gym newGym = gymRepository.findById(request.getNewGymId())
                .orElseThrow(() -> new RuntimeException("New gym not found"));
        
        GymPlan newPlan = planRepository.findById(request.getNewPlanId())
                .orElseThrow(() -> new RuntimeException("New plan not found"));

        // Validate new plan belongs to new gym
        if (!newPlan.getGymId().equals(request.getNewGymId())) {
            throw new RuntimeException("Plan does not belong to the selected gym");
        }

        // For HYBRID pass, ensure same owner
        if (currentPlan.getPassType() == com.techtammina.fitSwitch.enums.PassType.HYBRID) {
            if (!currentGym.getOwnerId().equals(newGym.getOwnerId())) {
                throw new RuntimeException("Hybrid pass holders can only switch between gyms of the same owner");
            }
        }

        // Calculate refund and usage
        MembershipCalculation calculation = calculateMembershipSwitch(currentMembership, newPlan);

        // Get or create wallet
        UserWallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> createWallet(userId));

        // Process old membership
        processOldMembership(currentMembership, calculation, wallet);

        // Create new membership
        Membership newMembership = createNewMembership(userId, request.getNewGymId(), 
                                                     request.getNewPlanId(), newPlan, calculation);

        // Process payment for new membership
        processNewMembershipPayment(newMembership, newGym, calculation, wallet);

        // Send email notification
        sendSwitchNotification(userId, currentMembership, newMembership, calculation);

        return new ApiResponse(true, "Membership switched successfully");
    }

    private MembershipCalculation calculateMembershipSwitch(Membership currentMembership, GymPlan newPlan) {
        LocalDate today = LocalDate.now();
        
        // Calculate days used and remaining
        long totalDays = ChronoUnit.DAYS.between(currentMembership.getStartDate(), currentMembership.getEndDate());
        long daysUsed = ChronoUnit.DAYS.between(currentMembership.getStartDate(), today);
        long daysRemaining = ChronoUnit.DAYS.between(today, currentMembership.getEndDate());
        
        if (daysRemaining < 0) daysRemaining = 0;
        if (daysUsed < 0) daysUsed = 0;

        // Get current plan price
        GymPlan currentPlan = planRepository.findById(currentMembership.getPlanId()).orElse(null);
        BigDecimal currentPlanPrice = currentPlan != null ? currentPlan.getPrice() : BigDecimal.ZERO;

        // Calculate per-day cost
        BigDecimal perDayCost = currentPlanPrice.divide(BigDecimal.valueOf(totalDays), 2, RoundingMode.HALF_UP);
        
        // Calculate amounts
        BigDecimal usedAmount = perDayCost.multiply(BigDecimal.valueOf(daysUsed));
        BigDecimal refundAmount = perDayCost.multiply(BigDecimal.valueOf(daysRemaining));
        
        // Calculate remaining amount needed for new plan
        BigDecimal additionalAmount = newPlan.getPrice().subtract(refundAmount);
        if (additionalAmount.compareTo(BigDecimal.ZERO) < 0) {
            additionalAmount = BigDecimal.ZERO;
        }

        MembershipCalculation calculation = new MembershipCalculation();
        calculation.setTotalDays(totalDays);
        calculation.setDaysUsed(daysUsed);
        calculation.setDaysRemaining(daysRemaining);
        calculation.setCurrentPlanPrice(currentPlanPrice);
        calculation.setNewPlanPrice(newPlan.getPrice());
        calculation.setPerDayCost(perDayCost);
        calculation.setUsedAmount(usedAmount);
        calculation.setRefundAmount(refundAmount);
        calculation.setAdditionalAmount(additionalAmount);
        
        return calculation;
    }

    private void processOldMembership(Membership currentMembership, MembershipCalculation calculation, UserWallet wallet) {
        // Mark old membership as switched
        currentMembership.setStatus(MembershipStatus.SWITCHED);
        membershipRepository.save(currentMembership);

        // Add refund to wallet if any
        if (calculation.getRefundAmount().compareTo(BigDecimal.ZERO) > 0) {
            wallet.setBalance(wallet.getBalance().add(calculation.getRefundAmount()));
            walletRepository.save(wallet);

            // Create refund transaction
            WalletTransaction refundTransaction = new WalletTransaction();
            refundTransaction.setUserId(currentMembership.getUserId());
            refundTransaction.setWalletId(wallet.getId());
            refundTransaction.setType(WalletTransaction.TransactionType.MEMBERSHIP_REFUND);
            refundTransaction.setAmount(calculation.getRefundAmount());
            refundTransaction.setBalanceAfter(wallet.getBalance());
            refundTransaction.setDescription("Refund from membership switch");
            refundTransaction.setMembershipId(currentMembership.getId());
            refundTransaction.setCreatedAt(LocalDateTime.now());
            transactionRepository.save(refundTransaction);
        }

        // Record owner earning for used portion
        if (calculation.getUsedAmount().compareTo(BigDecimal.ZERO) > 0) {
            Gym currentGym = gymRepository.findById(currentMembership.getGymId()).orElse(null);
            if (currentGym != null) {
                OwnerEarning earning = new OwnerEarning();
                earning.setOwnerId(currentGym.getOwnerId());
                earning.setGymId(currentMembership.getGymId());
                earning.setUserId(currentMembership.getUserId());
                earning.setType(OwnerEarning.EarningType.MEMBERSHIP_SWITCH_USED);
                earning.setAmount(calculation.getUsedAmount());
                earning.setDescription("Membership switch - used portion");
                earning.setMembershipId(currentMembership.getId());
                earning.setCreatedAt(LocalDateTime.now());
                ownerEarningRepository.save(earning);
            }
        }
    }

    private Membership createNewMembership(Long userId, Long newGymId, Long newPlanId, GymPlan newPlan, MembershipCalculation calculation) {
        Membership newMembership = new Membership();
        newMembership.setUserId(userId);
        newMembership.setGymId(newGymId);
        newMembership.setPlanId(newPlanId);
        newMembership.setStartDate(LocalDate.now());
        newMembership.setEndDate(LocalDate.now().plusDays(newPlan.getDurationDays()));
        newMembership.setStatus(MembershipStatus.ACTIVE);
        newMembership.setCreatedAt(LocalDateTime.now());
        
        return membershipRepository.save(newMembership);
    }

    private void processNewMembershipPayment(Membership newMembership, Gym newGym, MembershipCalculation calculation, UserWallet wallet) {
        // Check if additional payment needed
        if (calculation.getAdditionalAmount().compareTo(BigDecimal.ZERO) > 0) {
            // Check wallet balance
            if (wallet.getBalance().compareTo(calculation.getAdditionalAmount()) < 0) {
                throw new RuntimeException("Insufficient wallet balance for membership switch");
            }

            // Debit wallet
            wallet.setBalance(wallet.getBalance().subtract(calculation.getAdditionalAmount()));
            walletRepository.save(wallet);

            // Create payment transaction
            WalletTransaction paymentTransaction = new WalletTransaction();
            paymentTransaction.setUserId(newMembership.getUserId());
            paymentTransaction.setWalletId(wallet.getId());
            paymentTransaction.setType(WalletTransaction.TransactionType.MEMBERSHIP_SWITCH);
            paymentTransaction.setAmount(calculation.getAdditionalAmount().negate());
            paymentTransaction.setBalanceAfter(wallet.getBalance());
            paymentTransaction.setDescription("Payment for new membership");
            paymentTransaction.setMembershipId(newMembership.getId());
            paymentTransaction.setGymId(newMembership.getGymId());
            paymentTransaction.setCreatedAt(LocalDateTime.now());
            transactionRepository.save(paymentTransaction);
        }

        // Record owner earning for new membership
        OwnerEarning earning = new OwnerEarning();
        earning.setOwnerId(newGym.getOwnerId());
        earning.setGymId(newMembership.getGymId());
        earning.setUserId(newMembership.getUserId());
        earning.setType(OwnerEarning.EarningType.MEMBERSHIP_PURCHASE);
        earning.setAmount(calculation.getNewPlanPrice());
        earning.setDescription("New membership purchase");
        earning.setMembershipId(newMembership.getId());
        earning.setCreatedAt(LocalDateTime.now());
        ownerEarningRepository.save(earning);
    }

    private void sendSwitchNotification(Long userId, Membership oldMembership, Membership newMembership, MembershipCalculation calculation) {
        // Implementation for email notification
        // This would integrate with the existing EmailService
    }

    private UserWallet createWallet(Long userId) {
        UserWallet wallet = new UserWallet(userId, BigDecimal.ZERO);
        return walletRepository.save(wallet);
    }

    // Inner class for calculation results
    private static class MembershipCalculation {
        private long totalDays;
        private long daysUsed;
        private long daysRemaining;
        private BigDecimal currentPlanPrice;
        private BigDecimal newPlanPrice;
        private BigDecimal perDayCost;
        private BigDecimal usedAmount;
        private BigDecimal refundAmount;
        private BigDecimal additionalAmount;

        // Getters and setters
        public long getTotalDays() { return totalDays; }
        public void setTotalDays(long totalDays) { this.totalDays = totalDays; }

        public long getDaysUsed() { return daysUsed; }
        public void setDaysUsed(long daysUsed) { this.daysUsed = daysUsed; }

        public long getDaysRemaining() { return daysRemaining; }
        public void setDaysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; }

        public BigDecimal getCurrentPlanPrice() { return currentPlanPrice; }
        public void setCurrentPlanPrice(BigDecimal currentPlanPrice) { this.currentPlanPrice = currentPlanPrice; }

        public BigDecimal getNewPlanPrice() { return newPlanPrice; }
        public void setNewPlanPrice(BigDecimal newPlanPrice) { this.newPlanPrice = newPlanPrice; }

        public BigDecimal getPerDayCost() { return perDayCost; }
        public void setPerDayCost(BigDecimal perDayCost) { this.perDayCost = perDayCost; }

        public BigDecimal getUsedAmount() { return usedAmount; }
        public void setUsedAmount(BigDecimal usedAmount) { this.usedAmount = usedAmount; }

        public BigDecimal getRefundAmount() { return refundAmount; }
        public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

        public BigDecimal getAdditionalAmount() { return additionalAmount; }
        public void setAdditionalAmount(BigDecimal additionalAmount) { this.additionalAmount = additionalAmount; }
    }
}
