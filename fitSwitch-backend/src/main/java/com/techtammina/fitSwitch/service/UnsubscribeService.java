package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.*;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UnsubscribeService {

    private final UnsubscribeRequestRepository unsubscribeRequestRepository;
    private final MembershipRepository membershipRepository;
    private final GymRepository gymRepository;
    private final GymPlanRepository gymPlanRepository;
    private final UserRepository userRepository;
    private final UserWalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final OwnerEarningRepository ownerEarningRepository;
    private final EmailService emailService;

    private static final BigDecimal USER_REFUND_RATE = new BigDecimal("0.40");
    private static final BigDecimal OWNER_SHARE_RATE = new BigDecimal("0.60");

    public UnsubscribeService(UnsubscribeRequestRepository unsubscribeRequestRepository,
                            MembershipRepository membershipRepository,
                            GymRepository gymRepository,
                            GymPlanRepository gymPlanRepository,
                            UserRepository userRepository,
                            UserWalletRepository walletRepository,
                            WalletTransactionRepository transactionRepository,
                            OwnerEarningRepository ownerEarningRepository,
                            EmailService emailService) {
        this.unsubscribeRequestRepository = unsubscribeRequestRepository;
        this.membershipRepository = membershipRepository;
        this.gymRepository = gymRepository;
        this.gymPlanRepository = gymPlanRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.ownerEarningRepository = ownerEarningRepository;
        this.emailService = emailService;
    }

    @Transactional
    public ApiResponse createUnsubscribeRequest(Long userId, UnsubscribeRequestDto request) {
        // Get membership
        Membership membership = membershipRepository.findById(request.getMembershipId())
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        // Validate ownership
        if (!membership.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to membership");
        }

        // Check if membership is active
        if (membership.getStatus() != MembershipStatus.ACTIVE) {
            throw new RuntimeException("Only active memberships can be unsubscribed");
        }

        // Check if there's already a pending request
        unsubscribeRequestRepository.findByMembershipIdAndStatus(
                request.getMembershipId(), UnsubscribeRequest.RequestStatus.PENDING)
                .ifPresent(existing -> {
                    throw new RuntimeException("Unsubscribe request already pending for this membership");
                });

        // Get gym and plan details
        Gym gym = gymRepository.findById(membership.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        GymPlan plan = gymPlanRepository.findById(membership.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        // Calculate refund
        RefundCalculation calculation = calculateRefund(membership, plan);

        // Create unsubscribe request
        UnsubscribeRequest unsubscribeRequest = new UnsubscribeRequest();
        unsubscribeRequest.setUserId(userId);
        unsubscribeRequest.setMembershipId(request.getMembershipId());
        unsubscribeRequest.setGymId(membership.getGymId());
        unsubscribeRequest.setOwnerId(gym.getOwnerId());
        unsubscribeRequest.setStatus(UnsubscribeRequest.RequestStatus.PENDING);
        unsubscribeRequest.setRequestDate(LocalDateTime.now());
        unsubscribeRequest.setRefundAmount(calculation.getRefundAmount());
        unsubscribeRequest.setRemainingAmount(calculation.getRemainingAmount());
        unsubscribeRequest.setOwnerShare(calculation.getOwnerShare());
        unsubscribeRequest.setUsedMonths(calculation.getUsedMonths());
        unsubscribeRequest.setTotalMonths(plan.getDurationMonths());
        unsubscribeRequest.setReason(request.getReason());

        unsubscribeRequestRepository.save(unsubscribeRequest);

        return new ApiResponse(true, "Unsubscribe request submitted successfully. Awaiting owner approval.");
    }

    public RefundCalculationResponse getRefundCalculation(Long userId, Long membershipId) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        if (!membership.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to membership");
        }

        if (membership.getStatus() != MembershipStatus.ACTIVE) {
            throw new RuntimeException("Only active memberships can be calculated for refund");
        }

        GymPlan plan = gymPlanRepository.findById(membership.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        RefundCalculation calculation = calculateRefund(membership, plan);
        
        RefundCalculationResponse response = new RefundCalculationResponse();
        response.setRefundAmount(calculation.getRefundAmount());
        response.setRemainingAmount(calculation.getRemainingAmount());
        response.setOwnerShare(calculation.getOwnerShare());
        response.setUsedMonths(calculation.getUsedMonths());
        response.setRemainingMonths(calculation.getRemainingMonths());
        
        return response;
    }

    public List<UnsubscribeRequestResponse> getOwnerUnsubscribeRequests(Long ownerId) {
        List<UnsubscribeRequest> requests = unsubscribeRequestRepository
                .findByOwnerIdOrderByRequestDateDesc(ownerId);

        return requests.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<UnsubscribeRequestResponse> getUserUnsubscribeRequests(Long userId) {
        List<UnsubscribeRequest> requests = unsubscribeRequestRepository
                .findByUserIdOrderByRequestDateDesc(userId);

        return requests.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse approveUnsubscribeRequest(Long ownerId, Long requestId, ApprovalRequestDto approval) {
        UnsubscribeRequest request = unsubscribeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Unsubscribe request not found"));

        // Validate ownership
        if (!request.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized access to request");
        }

        // Check if request is pending
        if (request.getStatus() != UnsubscribeRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        // Update request status
        request.setStatus(UnsubscribeRequest.RequestStatus.APPROVED);
        request.setApprovalDate(LocalDateTime.now());
        request.setOwnerNotes(approval.getOwnerNotes());
        unsubscribeRequestRepository.save(request);

        // Update membership status
        Membership membership = membershipRepository.findById(request.getMembershipId())
                .orElseThrow(() -> new RuntimeException("Membership not found"));
        membership.setStatus(MembershipStatus.EXPIRED);
        membershipRepository.save(membership);

        return new ApiResponse(true, "Unsubscribe request approved. Refund must be processed separately.");
    }

    @Transactional
    public ApiResponse processRefund(Long ownerId, Long requestId) {
        UnsubscribeRequest request = unsubscribeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Unsubscribe request not found"));

        if (!request.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized access to request");
        }

        if (request.getStatus() != UnsubscribeRequest.RequestStatus.APPROVED) {
            throw new RuntimeException("Request must be approved first");
        }

        if (request.getRefundAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("No refund applicable");
        }

        UserWallet ownerWallet = walletRepository.findByUserId(request.getOwnerId())
                .orElseGet(() -> createWallet(request.getOwnerId()));

        if (ownerWallet.getBalance().compareTo(request.getRefundAmount()) < 0) {
            processDelayedRefund(request, ownerWallet);
            request.setStatus(UnsubscribeRequest.RequestStatus.REFUNDED);
            unsubscribeRequestRepository.save(request);
            return new ApiResponse(true, "Refund initiated. Owner wallet balance insufficient; user credited and owner will settle within 2-4 business days.");
        }

        processImmediateRefund(request, ownerWallet);
        request.setStatus(UnsubscribeRequest.RequestStatus.REFUNDED);
        unsubscribeRequestRepository.save(request);
        return new ApiResponse(true, "Refund processed successfully.");
    }

    public List<UnsubscribeRequestResponse> getApprovedRefundRequests(Long ownerId) {
        List<UnsubscribeRequest> requests = unsubscribeRequestRepository
                .findByOwnerIdAndStatusOrderByApprovalDateDesc(ownerId, UnsubscribeRequest.RequestStatus.APPROVED);

        return requests.stream()
                .filter(request -> request.getRefundAmount().compareTo(BigDecimal.ZERO) > 0)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse rejectUnsubscribeRequest(Long ownerId, Long requestId, ApprovalRequestDto rejection) {
        UnsubscribeRequest request = unsubscribeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Unsubscribe request not found"));

        // Validate ownership
        if (!request.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized access to request");
        }

        // Check if request is pending
        if (request.getStatus() != UnsubscribeRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        // Update request status
        request.setStatus(UnsubscribeRequest.RequestStatus.REJECTED);
        request.setApprovalDate(LocalDateTime.now());
        request.setOwnerNotes(rejection.getOwnerNotes());
        unsubscribeRequestRepository.save(request);

        return new ApiResponse(true, "Unsubscribe request rejected");
    }

    private RefundCalculation calculateRefund(Membership membership, GymPlan plan) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate = membership.getStartDate().atStartOfDay();
        LocalDateTime endDate = membership.getEndDate().atStartOfDay();
        
        // Calculate total days and used days (count today as 1 day if within range)
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate);
        long usedDays = ChronoUnit.DAYS.between(membership.getStartDate(), now.toLocalDate()) + 1;
        
        // Clamp used days between 0 and total days
        if (usedDays < 0) usedDays = 0;
        if (usedDays > totalDays) usedDays = totalDays;
        
        // Per-day amount (2-decimal rounding, as shown in example)
        BigDecimal dailyRate = plan.getPrice().divide(
                BigDecimal.valueOf(totalDays), 2, RoundingMode.HALF_UP);

        // Used amount = per-day * used days
        BigDecimal usedAmount = dailyRate.multiply(BigDecimal.valueOf(usedDays))
                .setScale(2, RoundingMode.HALF_UP);

        // Remaining amount = total fee - used amount
        BigDecimal remainingAmount = plan.getPrice().subtract(usedAmount)
                .setScale(2, RoundingMode.HALF_UP);
        if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
            remainingAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        
        // User gets 40% of remaining amount as refund
        BigDecimal userRefund = remainingAmount.multiply(USER_REFUND_RATE)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal ownerShare = remainingAmount.multiply(OWNER_SHARE_RATE)
                .setScale(2, RoundingMode.HALF_UP);
        
        // Calculate months for display
        int monthsUsed = (int) Math.ceil((double) usedDays / 30.0);
        int remainingMonths = Math.max(0, plan.getDurationMonths() - monthsUsed);

        RefundCalculation calculation = new RefundCalculation();
        calculation.setUsedMonths(monthsUsed);
        calculation.setRemainingMonths(remainingMonths);
        calculation.setRemainingAmount(remainingAmount);
        calculation.setRefundAmount(userRefund);
        calculation.setOwnerShare(ownerShare);
        
        return calculation;
    }

    private String processRefundWithWalletCheck(UnsubscribeRequest request) {
        if (request.getRefundAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return "No refund applicable.";
        }

        UserWallet ownerWallet = walletRepository.findByUserId(request.getOwnerId())
                .orElseGet(() -> createWallet(request.getOwnerId()));

        if (ownerWallet.getBalance().compareTo(request.getRefundAmount()) < 0) {
            throw new RuntimeException("Insufficient wallet balance. Please add funds to process refund.");
        }

        processImmediateRefund(request, ownerWallet);
        return "Refund processed successfully.";
    }

    private void processImmediateRefund(UnsubscribeRequest request, UserWallet ownerWallet) {
        // Debit owner wallet
        ownerWallet.setBalance(ownerWallet.getBalance().subtract(request.getRefundAmount()));
        walletRepository.save(ownerWallet);

        // Create owner debit transaction
        WalletTransaction ownerTransaction = new WalletTransaction();
        ownerTransaction.setUserId(request.getOwnerId());
        ownerTransaction.setWalletId(ownerWallet.getId());
        ownerTransaction.setType(WalletTransaction.TransactionType.MEMBERSHIP_REFUND);
        ownerTransaction.setAmount(request.getRefundAmount().negate());
        ownerTransaction.setBalanceAfter(ownerWallet.getBalance());
        ownerTransaction.setDescription("Membership refund debit");
        ownerTransaction.setMembershipId(request.getMembershipId());
        ownerTransaction.setGymId(request.getGymId());
        ownerTransaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(ownerTransaction);

        // Record owner earning refund (negative)
        OwnerEarning refundEarning = new OwnerEarning();
        refundEarning.setOwnerId(request.getOwnerId());
        refundEarning.setGymId(request.getGymId());
        refundEarning.setUserId(request.getUserId());
        refundEarning.setType(OwnerEarning.EarningType.MEMBERSHIP_REFUND);
        refundEarning.setAmount(request.getRefundAmount().negate());
        refundEarning.setDescription("Membership refund debit");
        refundEarning.setMembershipId(request.getMembershipId());
        refundEarning.setCreatedAt(LocalDateTime.now());
        ownerEarningRepository.save(refundEarning);

        // Get or create user wallet
        UserWallet userWallet = walletRepository.findByUserId(request.getUserId())
                .orElseGet(() -> createWallet(request.getUserId()));

        // Credit user wallet
        userWallet.setBalance(userWallet.getBalance().add(request.getRefundAmount()));
        walletRepository.save(userWallet);

        // Create user credit transaction
        WalletTransaction userTransaction = new WalletTransaction();
        userTransaction.setUserId(request.getUserId());
        userTransaction.setWalletId(userWallet.getId());
        userTransaction.setType(WalletTransaction.TransactionType.MEMBERSHIP_REFUND);
        userTransaction.setAmount(request.getRefundAmount());
        userTransaction.setBalanceAfter(userWallet.getBalance());
        userTransaction.setDescription("Membership unsubscribe refund");
        userTransaction.setMembershipId(request.getMembershipId());
        userTransaction.setGymId(request.getGymId());
        userTransaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(userTransaction);

        // Send email notification to user
        sendRefundNotificationToUser(request, true);
    }

    private void processDelayedRefund(UnsubscribeRequest request, UserWallet ownerWallet) {
        // Update owner wallet to negative balance
        ownerWallet.setBalance(ownerWallet.getBalance().subtract(request.getRefundAmount()));
        walletRepository.save(ownerWallet);

        // Create owner debit transaction
        WalletTransaction ownerTransaction = new WalletTransaction();
        ownerTransaction.setUserId(request.getOwnerId());
        ownerTransaction.setWalletId(ownerWallet.getId());
        ownerTransaction.setType(WalletTransaction.TransactionType.MEMBERSHIP_REFUND);
        ownerTransaction.setAmount(request.getRefundAmount().negate());
        ownerTransaction.setBalanceAfter(ownerWallet.getBalance());
        ownerTransaction.setDescription("Membership refund debit - insufficient balance");
        ownerTransaction.setMembershipId(request.getMembershipId());
        ownerTransaction.setGymId(request.getGymId());
        ownerTransaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(ownerTransaction);

        // Record owner earning refund (negative)
        OwnerEarning refundEarning = new OwnerEarning();
        refundEarning.setOwnerId(request.getOwnerId());
        refundEarning.setGymId(request.getGymId());
        refundEarning.setUserId(request.getUserId());
        refundEarning.setType(OwnerEarning.EarningType.MEMBERSHIP_REFUND);
        refundEarning.setAmount(request.getRefundAmount().negate());
        refundEarning.setDescription("Membership refund debit - insufficient balance");
        refundEarning.setMembershipId(request.getMembershipId());
        refundEarning.setCreatedAt(LocalDateTime.now());
        ownerEarningRepository.save(refundEarning);

        // Get or create user wallet and credit immediately
        UserWallet userWallet = walletRepository.findByUserId(request.getUserId())
                .orElseGet(() -> createWallet(request.getUserId()));

        // Credit user wallet immediately
        userWallet.setBalance(userWallet.getBalance().add(request.getRefundAmount()));
        walletRepository.save(userWallet);

        // Create user credit transaction
        WalletTransaction userTransaction = new WalletTransaction();
        userTransaction.setUserId(request.getUserId());
        userTransaction.setWalletId(userWallet.getId());
        userTransaction.setType(WalletTransaction.TransactionType.MEMBERSHIP_REFUND);
        userTransaction.setAmount(request.getRefundAmount());
        userTransaction.setBalanceAfter(userWallet.getBalance());
        userTransaction.setDescription("Membership refund - owner will settle within 2-4 days");
        userTransaction.setMembershipId(request.getMembershipId());
        userTransaction.setGymId(request.getGymId());
        userTransaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(userTransaction);
        
        // Send notifications
        sendRefundNotificationToUser(request, false);
        sendBalanceNotificationToOwner(request);
    }

    private void sendRefundNotificationToUser(UnsubscribeRequest request, boolean isImmediate) {
        try {
            userRepository.findById(request.getUserId()).ifPresent(user -> {
                gymRepository.findById(request.getGymId()).ifPresent(gym -> {
                    emailService.sendRefundNotification(
                        user.getEmail(),
                        gym.getGymName(),
                        request.getRefundAmount(),
                        isImmediate
                    );
                });
            });
        } catch (Exception e) {
            // Log error but don't fail the transaction
            System.err.println("Failed to send refund notification: " + e.getMessage());
        }
    }

    private void sendBalanceNotificationToOwner(UnsubscribeRequest request) {
        try {
            userRepository.findById(request.getOwnerId()).ifPresent(owner -> {
                gymRepository.findById(request.getGymId()).ifPresent(gym -> {
                    emailService.sendOwnerBalanceNotification(
                        owner.getEmail(),
                        gym.getGymName(),
                        request.getRefundAmount()
                    );
                });
            });
        } catch (Exception e) {
            // Log error but don't fail the transaction
            System.err.println("Failed to send owner balance notification: " + e.getMessage());
        }
    }

    private UserWallet createWallet(Long userId) {
        UserWallet wallet = new UserWallet(userId, BigDecimal.ZERO);
        return walletRepository.save(wallet);
    }

    private UnsubscribeRequestResponse mapToResponse(UnsubscribeRequest request) {
        UnsubscribeRequestResponse response = new UnsubscribeRequestResponse();
        response.setId(request.getId());
        response.setUserId(request.getUserId());
        response.setMembershipId(request.getMembershipId());
        response.setStatus(request.getStatus());
        response.setRequestDate(request.getRequestDate());
        response.setApprovalDate(request.getApprovalDate());
        response.setRefundAmount(request.getRefundAmount());
        if (request.getRemainingAmount() != null && request.getOwnerShare() != null) {
            response.setRemainingAmount(request.getRemainingAmount());
            response.setOwnerShare(request.getOwnerShare());
        } else if (request.getRefundAmount() != null) {
            BigDecimal remainingAmount = request.getRefundAmount()
                    .divide(USER_REFUND_RATE, 2, RoundingMode.HALF_UP);
            BigDecimal ownerShare = remainingAmount
                    .multiply(OWNER_SHARE_RATE)
                    .setScale(2, RoundingMode.HALF_UP);
            response.setRemainingAmount(remainingAmount);
            response.setOwnerShare(ownerShare);
        }
        response.setUsedMonths(request.getUsedMonths());
        response.setTotalMonths(request.getTotalMonths());
        response.setReason(request.getReason());
        response.setOwnerNotes(request.getOwnerNotes());

        // Add user details
        userRepository.findById(request.getUserId()).ifPresent(user -> {
            response.setUserName(user.getFullName());
            response.setUserEmail(user.getEmail());
        });

        // Add gym details
        gymRepository.findById(request.getGymId()).ifPresent(gym -> {
            response.setGymName(gym.getGymName());
        });

        // Add plan details
        membershipRepository.findById(request.getMembershipId()).ifPresent(membership -> {
            gymPlanRepository.findById(membership.getPlanId()).ifPresent(plan -> {
                response.setPlanName(plan.getPlanName());
            });
        });

        return response;
    }

    // Inner class for refund calculation
    private static class RefundCalculation {
        private int usedMonths;
        private int remainingMonths;
        private BigDecimal refundAmount;
        private BigDecimal remainingAmount;
        private BigDecimal ownerShare;

        public int getUsedMonths() { return usedMonths; }
        public void setUsedMonths(int usedMonths) { this.usedMonths = usedMonths; }

        public int getRemainingMonths() { return remainingMonths; }
        public void setRemainingMonths(int remainingMonths) { this.remainingMonths = remainingMonths; }

        public BigDecimal getRefundAmount() { return refundAmount; }
        public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

        public BigDecimal getRemainingAmount() { return remainingAmount; }
        public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

        public BigDecimal getOwnerShare() { return ownerShare; }
        public void setOwnerShare(BigDecimal ownerShare) { this.ownerShare = ownerShare; }
    }
}
