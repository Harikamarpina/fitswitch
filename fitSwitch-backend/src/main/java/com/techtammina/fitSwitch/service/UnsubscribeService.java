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

    public UnsubscribeService(UnsubscribeRequestRepository unsubscribeRequestRepository,
                            MembershipRepository membershipRepository,
                            GymRepository gymRepository,
                            GymPlanRepository gymPlanRepository,
                            UserRepository userRepository,
                            UserWalletRepository walletRepository,
                            WalletTransactionRepository transactionRepository,
                            OwnerEarningRepository ownerEarningRepository) {
        this.unsubscribeRequestRepository = unsubscribeRequestRepository;
        this.membershipRepository = membershipRepository;
        this.gymRepository = gymRepository;
        this.gymPlanRepository = gymPlanRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.ownerEarningRepository = ownerEarningRepository;
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
        unsubscribeRequest.setUsedMonths(calculation.getUsedMonths());
        unsubscribeRequest.setTotalMonths(plan.getDurationMonths());
        unsubscribeRequest.setReason(request.getReason());

        unsubscribeRequestRepository.save(unsubscribeRequest);

        return new ApiResponse(true, "Unsubscribe request submitted successfully. Awaiting owner approval.");
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

        // Process refund
        processRefund(request);

        // Update membership status
        Membership membership = membershipRepository.findById(request.getMembershipId())
                .orElseThrow(() -> new RuntimeException("Membership not found"));
        membership.setStatus(MembershipStatus.EXPIRED);
        membershipRepository.save(membership);

        return new ApiResponse(true, "Unsubscribe request approved and refund processed");
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
        
        // Calculate months used (any partial month counts as full month for owner)
        long daysUsed = ChronoUnit.DAYS.between(startDate, now);
        int monthsUsed = (int) Math.ceil((double) daysUsed / 30.0); // Round up partial months
        
        // Ensure we don't exceed total months
        if (monthsUsed > plan.getDurationMonths()) {
            monthsUsed = plan.getDurationMonths();
        }

        int remainingMonths = plan.getDurationMonths() - monthsUsed;
        
        // Calculate refund amount
        BigDecimal monthlyRate = plan.getPrice().divide(
                BigDecimal.valueOf(plan.getDurationMonths()), 2, RoundingMode.HALF_UP);
        BigDecimal refundAmount = monthlyRate.multiply(BigDecimal.valueOf(remainingMonths));

        RefundCalculation calculation = new RefundCalculation();
        calculation.setUsedMonths(monthsUsed);
        calculation.setRemainingMonths(remainingMonths);
        calculation.setRefundAmount(refundAmount);
        calculation.setMonthlyRate(monthlyRate);
        
        return calculation;
    }

    private void processRefund(UnsubscribeRequest request) {
        if (request.getRefundAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return; // No refund needed
        }

        // Get or create user wallet
        UserWallet wallet = walletRepository.findByUserId(request.getUserId())
                .orElseGet(() -> createWallet(request.getUserId()));

        // Credit user wallet
        wallet.setBalance(wallet.getBalance().add(request.getRefundAmount()));
        walletRepository.save(wallet);

        // Create wallet transaction
        WalletTransaction transaction = new WalletTransaction();
        transaction.setUserId(request.getUserId());
        transaction.setWalletId(wallet.getId());
        transaction.setType(WalletTransaction.TransactionType.MEMBERSHIP_REFUND);
        transaction.setAmount(request.getRefundAmount());
        transaction.setBalanceAfter(wallet.getBalance());
        transaction.setDescription("Membership unsubscribe refund");
        transaction.setMembershipId(request.getMembershipId());
        transaction.setGymId(request.getGymId());
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);
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
        private BigDecimal monthlyRate;

        public int getUsedMonths() { return usedMonths; }
        public void setUsedMonths(int usedMonths) { this.usedMonths = usedMonths; }

        public int getRemainingMonths() { return remainingMonths; }
        public void setRemainingMonths(int remainingMonths) { this.remainingMonths = remainingMonths; }

        public BigDecimal getRefundAmount() { return refundAmount; }
        public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

        public BigDecimal getMonthlyRate() { return monthlyRate; }
        public void setMonthlyRate(BigDecimal monthlyRate) { this.monthlyRate = monthlyRate; }
    }
}