package com.techtammina.fitSwitch.service;

import com.techtammina.fitSwitch.dto.*;
import com.techtammina.fitSwitch.entity.*;
import com.techtammina.fitSwitch.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WalletService {

    private final UserWalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final OwnerEarningRepository ownerEarningRepository;
    private final GymRepository gymRepository;
    private final GymFacilityRepository facilityRepository;
    private final EmailService emailService;

    public WalletService(UserWalletRepository walletRepository,
                        WalletTransactionRepository transactionRepository,
                        OwnerEarningRepository ownerEarningRepository,
                        GymRepository gymRepository,
                        GymFacilityRepository facilityRepository,
                        EmailService emailService) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.ownerEarningRepository = ownerEarningRepository;
        this.gymRepository = gymRepository;
        this.facilityRepository = facilityRepository;
        this.emailService = emailService;
    }

    public WalletResponse getOrCreateWallet(Long userId) {
        UserWallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> createWallet(userId));
        return mapToWalletResponse(wallet);
    }

    private UserWallet createWallet(Long userId) {
        UserWallet wallet = new UserWallet(userId, BigDecimal.ZERO);
        return walletRepository.save(wallet);
    }

    @Transactional
    public WalletResponse addMoney(Long userId, AddMoneyRequest request) {
        UserWallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> createWallet(userId));

        BigDecimal oldBalance = wallet.getBalance();
        BigDecimal newBalance = oldBalance.add(request.getAmount());
        wallet.setBalance(newBalance);
        
        UserWallet savedWallet = walletRepository.save(wallet);

        // Create transaction record
        WalletTransaction transaction = new WalletTransaction();
        transaction.setUserId(userId);
        transaction.setWalletId(savedWallet.getId());
        transaction.setType(WalletTransaction.TransactionType.ADD_MONEY);
        transaction.setAmount(request.getAmount());
        transaction.setBalanceAfter(newBalance);
        transaction.setDescription("Money added to wallet");
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        return mapToWalletResponse(savedWallet);
    }

    @Transactional
    public ApiResponse useFacility(Long userId, FacilityUsageRequest request) {
        // Get user wallet
        UserWallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // Get gym and facility details
        Gym gym = gymRepository.findById(request.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        GymFacility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        // Validate facility belongs to gym
        if (!facility.getGymId().equals(request.getGymId())) {
            throw new RuntimeException("Facility does not belong to the selected gym");
        }

        // Calculate facility usage cost (assuming 10% of monthly plan cost for single use)
        BigDecimal usageCost = calculateFacilityUsageCost(request.getGymId());

        // Check wallet balance
        if (wallet.getBalance().compareTo(usageCost) < 0) {
            throw new RuntimeException("Insufficient wallet balance");
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
        transaction.setDescription("Facility usage: " + facility.getFacilityName() + " at " + gym.getGymName());
        transaction.setGymId(request.getGymId());
        transaction.setFacilityId(request.getFacilityId());
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        // Credit gym owner
        OwnerEarning earning = new OwnerEarning();
        earning.setOwnerId(gym.getOwnerId());
        earning.setGymId(request.getGymId());
        earning.setUserId(userId);
        earning.setType(OwnerEarning.EarningType.FACILITY_USAGE);
        earning.setAmount(usageCost);
        earning.setDescription("Facility usage payment: " + facility.getFacilityName());
        earning.setFacilityId(request.getFacilityId());
        earning.setTransactionId(transaction.getId());
        earning.setCreatedAt(LocalDateTime.now());
        ownerEarningRepository.save(earning);

        // Credit owner wallet with facility usage earning
        UserWallet ownerWallet = walletRepository.findByUserId(gym.getOwnerId())
                .orElseGet(() -> createWallet(gym.getOwnerId()));
        ownerWallet.setBalance(ownerWallet.getBalance().add(usageCost));
        UserWallet savedOwnerWallet = walletRepository.save(ownerWallet);

        WalletTransaction ownerWalletTxn = new WalletTransaction();
        ownerWalletTxn.setUserId(gym.getOwnerId());
        ownerWalletTxn.setWalletId(savedOwnerWallet.getId());
        ownerWalletTxn.setType(WalletTransaction.TransactionType.OWNER_EARNING);
        ownerWalletTxn.setAmount(usageCost);
        ownerWalletTxn.setBalanceAfter(savedOwnerWallet.getBalance());
        ownerWalletTxn.setDescription("Owner earning: facility usage");
        ownerWalletTxn.setGymId(request.getGymId());
        ownerWalletTxn.setFacilityId(request.getFacilityId());
        ownerWalletTxn.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(ownerWalletTxn);

        return new ApiResponse(true, "Facility access granted successfully");
    }

    private BigDecimal calculateFacilityUsageCost(Long gymId) {
        // Simple logic: fixed cost of 50 per facility usage
        // In real implementation, this could be configurable per facility
        return new BigDecimal("50.00");
    }

    public List<WalletTransactionResponse> getTransactionHistory(Long userId) {
        List<WalletTransaction> transactions = transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        return transactions.stream()
                .map(this::mapToTransactionResponse)
                .toList();
    }

    private WalletTransactionResponse mapToTransactionResponse(WalletTransaction transaction) {
        WalletTransactionResponse response = new WalletTransactionResponse();
        response.setId(transaction.getId());
        response.setType(transaction.getType());
        response.setAmount(transaction.getAmount());
        response.setBalanceAfter(transaction.getBalanceAfter());
        response.setDescription(transaction.getDescription());
        response.setCreatedAt(transaction.getCreatedAt());

        // Add gym and facility names if available
        if (transaction.getGymId() != null) {
            gymRepository.findById(transaction.getGymId())
                    .ifPresent(gym -> response.setGymName(gym.getGymName()));
        }
        
        if (transaction.getFacilityId() != null) {
            facilityRepository.findById(transaction.getFacilityId())
                    .ifPresent(facility -> response.setFacilityName(facility.getFacilityName()));
        }

        return response;
    }

    private WalletResponse mapToWalletResponse(UserWallet wallet) {
        WalletResponse response = new WalletResponse();
        response.setId(wallet.getId());
        response.setUserId(wallet.getUserId());
        response.setBalance(wallet.getBalance());
        response.setCreatedAt(wallet.getCreatedAt());
        response.setUpdatedAt(wallet.getUpdatedAt());
        return response;
    }
}
