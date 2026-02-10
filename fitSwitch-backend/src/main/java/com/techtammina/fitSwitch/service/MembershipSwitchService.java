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
    private final GymMembershipSessionRepository gymMembershipSessionRepository;
    private final UserWalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final OwnerEarningRepository ownerEarningRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public MembershipSwitchService(MembershipRepository membershipRepository,
                                 GymRepository gymRepository,
                                 GymPlanRepository planRepository,
                                 GymMembershipSessionRepository gymMembershipSessionRepository,
                                 UserWalletRepository walletRepository,
                                 WalletTransactionRepository transactionRepository,
                                 OwnerEarningRepository ownerEarningRepository,
                                 UserRepository userRepository,
                                 EmailService emailService) {
        this.membershipRepository = membershipRepository;
        this.gymRepository = gymRepository;
        this.planRepository = planRepository;
        this.gymMembershipSessionRepository = gymMembershipSessionRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.ownerEarningRepository = ownerEarningRepository;
        this.userRepository = userRepository;
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

        // HYBRID pass holders can switch to any gym

        // Calculate refund and usage based on attendance
        MembershipCalculation calculation = calculateMembershipSwitch(currentMembership, newPlan);

        // Get or create wallet
        UserWallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> createWallet(userId));

        UserWallet oldOwnerWallet = walletRepository.findByUserId(currentGym.getOwnerId())
                .orElseGet(() -> createWallet(currentGym.getOwnerId()));

        if (oldOwnerWallet.getBalance().compareTo(calculation.getRemainingAmount()) < 0) {
            throw new RuntimeException("Current gym owner has insufficient balance to process the switch. Please try again later.");
        }

        if (wallet.getBalance().add(calculation.getRemainingAmount()).compareTo(calculation.getNewPlanPrice()) < 0) {
            throw new RuntimeException("Insufficient wallet balance for membership switch");
        }

        // Process old membership and remaining balance transfer
        processOldMembership(currentMembership);
        processRemainingBalanceTransfer(currentMembership, currentGym, oldOwnerWallet, wallet, calculation);

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
        // Calculate days used based on attendance
        long totalDays = ChronoUnit.DAYS.between(currentMembership.getStartDate(), currentMembership.getEndDate());
        if (totalDays <= 0) {
            totalDays = Math.max(1, newPlan.getDurationDays());
        }
        long daysUsed = gymMembershipSessionRepository.countCompletedVisitDaysByMembershipId(currentMembership.getId());

        // Get current plan price
        GymPlan currentPlan = planRepository.findById(currentMembership.getPlanId()).orElse(null);
        BigDecimal currentPlanPrice = currentPlan != null ? currentPlan.getPrice() : BigDecimal.ZERO;

        // Calculate per-day cost
        BigDecimal perDayCost = currentPlanPrice.divide(BigDecimal.valueOf(totalDays), 2, RoundingMode.HALF_UP);

        // Calculate amounts
        BigDecimal usedAmount = perDayCost.multiply(BigDecimal.valueOf(daysUsed));
        if (usedAmount.compareTo(currentPlanPrice) > 0) {
            usedAmount = currentPlanPrice;
        }
        BigDecimal remainingAmount = currentPlanPrice.subtract(usedAmount).setScale(2, RoundingMode.HALF_UP);
        if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
            remainingAmount = BigDecimal.ZERO;
        }

        BigDecimal creditToNewPlan = remainingAmount.min(newPlan.getPrice());
        BigDecimal additionalAmount = newPlan.getPrice().subtract(creditToNewPlan).setScale(2, RoundingMode.HALF_UP);
        BigDecimal extraCredit = remainingAmount.subtract(creditToNewPlan).setScale(2, RoundingMode.HALF_UP);

        MembershipCalculation calculation = new MembershipCalculation();
        calculation.setTotalDays(totalDays);
        calculation.setDaysUsed(daysUsed);
        calculation.setCurrentPlanPrice(currentPlanPrice);
        calculation.setNewPlanPrice(newPlan.getPrice());
        calculation.setPerDayCost(perDayCost);
        calculation.setUsedAmount(usedAmount);
        calculation.setRemainingAmount(remainingAmount);
        calculation.setCreditToNewPlan(creditToNewPlan);
        calculation.setExtraCredit(extraCredit);
        calculation.setAdditionalAmount(additionalAmount);
        
        return calculation;
    }

    private void processOldMembership(Membership currentMembership) {
        // Mark old membership as switched
        currentMembership.setStatus(MembershipStatus.SWITCHED);
        membershipRepository.save(currentMembership);
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

    private void processRemainingBalanceTransfer(Membership currentMembership,
                                                 Gym currentGym,
                                                 UserWallet oldOwnerWallet,
                                                 UserWallet userWallet,
                                                 MembershipCalculation calculation) {
        if (calculation.getRemainingAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        // Debit old owner wallet
        oldOwnerWallet.setBalance(oldOwnerWallet.getBalance().subtract(calculation.getRemainingAmount()));
        UserWallet savedOldOwnerWallet = walletRepository.save(oldOwnerWallet);

        WalletTransaction ownerDebit = new WalletTransaction();
        ownerDebit.setUserId(currentGym.getOwnerId());
        ownerDebit.setWalletId(savedOldOwnerWallet.getId());
        ownerDebit.setType(WalletTransaction.TransactionType.OWNER_REFUND);
        ownerDebit.setAmount(calculation.getRemainingAmount().negate());
        ownerDebit.setBalanceAfter(savedOldOwnerWallet.getBalance());
        ownerDebit.setDescription("Owner refund for membership switch");
        ownerDebit.setGymId(currentMembership.getGymId());
        ownerDebit.setMembershipId(currentMembership.getId());
        ownerDebit.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(ownerDebit);

        OwnerEarning refundEarning = new OwnerEarning();
        refundEarning.setOwnerId(currentGym.getOwnerId());
        refundEarning.setGymId(currentMembership.getGymId());
        refundEarning.setUserId(currentMembership.getUserId());
        refundEarning.setType(OwnerEarning.EarningType.MEMBERSHIP_REFUND);
        refundEarning.setAmount(calculation.getRemainingAmount());
        refundEarning.setDescription("Membership switch refund to user");
        refundEarning.setMembershipId(currentMembership.getId());
        refundEarning.setCreatedAt(LocalDateTime.now());
        ownerEarningRepository.save(refundEarning);

        // Credit user wallet
        userWallet.setBalance(userWallet.getBalance().add(calculation.getRemainingAmount()));
        walletRepository.save(userWallet);

        WalletTransaction refundTxn = new WalletTransaction();
        refundTxn.setUserId(currentMembership.getUserId());
        refundTxn.setWalletId(userWallet.getId());
        refundTxn.setType(WalletTransaction.TransactionType.MEMBERSHIP_REFUND);
        refundTxn.setAmount(calculation.getRemainingAmount());
        refundTxn.setBalanceAfter(userWallet.getBalance());
        refundTxn.setDescription("Remaining balance credited from membership switch");
        refundTxn.setGymId(currentMembership.getGymId());
        refundTxn.setMembershipId(currentMembership.getId());
        refundTxn.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(refundTxn);
    }

    private void processNewMembershipPayment(Membership newMembership, Gym newGym, MembershipCalculation calculation, UserWallet wallet) {
        // Debit wallet for full new plan price
        wallet.setBalance(wallet.getBalance().subtract(calculation.getNewPlanPrice()));
        walletRepository.save(wallet);

        WalletTransaction paymentTransaction = new WalletTransaction();
        paymentTransaction.setUserId(newMembership.getUserId());
        paymentTransaction.setWalletId(wallet.getId());
        paymentTransaction.setType(WalletTransaction.TransactionType.MEMBERSHIP_SWITCH);
        paymentTransaction.setAmount(calculation.getNewPlanPrice().negate());
        paymentTransaction.setBalanceAfter(wallet.getBalance());
        paymentTransaction.setDescription("Payment for new membership");
        paymentTransaction.setMembershipId(newMembership.getId());
        paymentTransaction.setGymId(newMembership.getGymId());
        paymentTransaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(paymentTransaction);

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

        // Credit new gym owner wallet
        UserWallet newOwnerWallet = walletRepository.findByUserId(newGym.getOwnerId())
                .orElseGet(() -> createWallet(newGym.getOwnerId()));
        newOwnerWallet.setBalance(newOwnerWallet.getBalance().add(calculation.getNewPlanPrice()));
        UserWallet savedOwnerWallet = walletRepository.save(newOwnerWallet);

        WalletTransaction ownerWalletTxn = new WalletTransaction();
        ownerWalletTxn.setUserId(newGym.getOwnerId());
        ownerWalletTxn.setWalletId(savedOwnerWallet.getId());
        ownerWalletTxn.setType(WalletTransaction.TransactionType.OWNER_EARNING);
        ownerWalletTxn.setAmount(calculation.getNewPlanPrice());
        ownerWalletTxn.setBalanceAfter(savedOwnerWallet.getBalance());
        ownerWalletTxn.setDescription("Owner earning: membership switch");
        ownerWalletTxn.setGymId(newMembership.getGymId());
        ownerWalletTxn.setMembershipId(newMembership.getId());
        ownerWalletTxn.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(ownerWalletTxn);
    }

    private void sendSwitchNotification(Long userId, Membership oldMembership, Membership newMembership, MembershipCalculation calculation) {
        userRepository.findById(userId).ifPresent(user -> {
            Gym gym = gymRepository.findById(newMembership.getGymId()).orElse(null);
            GymPlan plan = planRepository.findById(newMembership.getPlanId()).orElse(null);
            String gymName = gym != null ? gym.getGymName() : "Your New Gym";
            String planName = plan != null ? plan.getPlanName() : "New Plan";

            emailService.sendMembershipConfirmation(
                    user.getEmail(),
                    gymName,
                    planName,
                    newMembership.getStartDate(),
                    newMembership.getEndDate(),
                    calculation.getNewPlanPrice()
            );
        });
    }

    private UserWallet createWallet(Long userId) {
        UserWallet wallet = new UserWallet(userId, BigDecimal.ZERO);
        return walletRepository.save(wallet);
    }

    // Inner class for calculation results
    private static class MembershipCalculation {
        private long totalDays;
        private long daysUsed;
        private BigDecimal currentPlanPrice;
        private BigDecimal newPlanPrice;
        private BigDecimal perDayCost;
        private BigDecimal usedAmount;
        private BigDecimal remainingAmount;
        private BigDecimal creditToNewPlan;
        private BigDecimal extraCredit;
        private BigDecimal additionalAmount;

        // Getters and setters
        public long getTotalDays() { return totalDays; }
        public void setTotalDays(long totalDays) { this.totalDays = totalDays; }

        public long getDaysUsed() { return daysUsed; }
        public void setDaysUsed(long daysUsed) { this.daysUsed = daysUsed; }

        public BigDecimal getCurrentPlanPrice() { return currentPlanPrice; }
        public void setCurrentPlanPrice(BigDecimal currentPlanPrice) { this.currentPlanPrice = currentPlanPrice; }

        public BigDecimal getNewPlanPrice() { return newPlanPrice; }
        public void setNewPlanPrice(BigDecimal newPlanPrice) { this.newPlanPrice = newPlanPrice; }

        public BigDecimal getPerDayCost() { return perDayCost; }
        public void setPerDayCost(BigDecimal perDayCost) { this.perDayCost = perDayCost; }

        public BigDecimal getUsedAmount() { return usedAmount; }
        public void setUsedAmount(BigDecimal usedAmount) { this.usedAmount = usedAmount; }

        public BigDecimal getRemainingAmount() { return remainingAmount; }
        public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

        public BigDecimal getCreditToNewPlan() { return creditToNewPlan; }
        public void setCreditToNewPlan(BigDecimal creditToNewPlan) { this.creditToNewPlan = creditToNewPlan; }

        public BigDecimal getExtraCredit() { return extraCredit; }
        public void setExtraCredit(BigDecimal extraCredit) { this.extraCredit = extraCredit; }

        public BigDecimal getAdditionalAmount() { return additionalAmount; }
        public void setAdditionalAmount(BigDecimal additionalAmount) { this.additionalAmount = additionalAmount; }
    }
}
