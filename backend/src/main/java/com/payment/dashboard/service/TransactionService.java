package com.payment.dashboard.service;

import com.payment.dashboard.model.AuditLog;
import com.payment.dashboard.model.Transaction;
import com.payment.dashboard.repository.AuditLogRepository;
import com.payment.dashboard.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    @Autowired private TransactionRepository repository;
    @Autowired private AuditLogRepository auditRepository;

    public List<Transaction> getAllTransactions() {
        return repository.findAll();
    }

    public List<Transaction> search(String keyword) {
        return repository.searchByKeyword(keyword);
    }

    public List<Transaction> filterByStatus(String status) {
        return repository.findByStatus(status);
    }

    public Transaction saveTransaction(Transaction t) {
        t.setTimestamp(java.time.LocalDateTime.now());
        if(t.getMerchant() == null) t.setMerchant("Unknown Merchant");
        return repository.save(t);
    }
    
    public Map<String, Long> getStatusStats() {
        return repository.findAll().stream()
                .collect(Collectors.groupingBy(Transaction::getStatus, Collectors.counting()));
    }

    // NEW: Audit Log Logic
    public void logAction(String action, String user) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setUsername(user);
        log.setTimestamp(java.time.LocalDateTime.now());
        auditRepository.save(log);
    }

    // ... existing code ...

    // NEW: Handle Refund Logic
    public Transaction processRefund(Long id) {
        Transaction t = repository.findById(id).orElseThrow(() -> new RuntimeException("Transaction not found"));
        if("SUCCESS".equals(t.getStatus())) {
            t.setRefundStatus("REFUNDED");
            t.setAmount(0.0); // Optional: Set amount to 0 or keep original
            logAction("REFUND_PROCESSED: " + t.getTransactionId(), "Agent");
            return repository.save(t);
        }
        throw new RuntimeException("Cannot refund incomplete transaction");
    }

    // NEW: Handle Fraud Logic
    public Transaction markAsFraud(Long id) {
        Transaction t = repository.findById(id).orElseThrow(() -> new RuntimeException("Transaction not found"));
        t.setStatus("FAILED");
        t.setFailureReason("FRAUD_DETECTED");
        logAction("FRAUD_FLAGGED: " + t.getTransactionId(), "Agent");
        return repository.save(t);
    }
}