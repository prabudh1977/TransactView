package com.payment.dashboard.controller;

import com.payment.dashboard.model.Transaction;
import com.payment.dashboard.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*") 
public class TransactionController {
    
    @Autowired private TransactionService service;

    // 1. Get All Transactions
    @GetMapping
    public List<Transaction> getAll() {
        return service.getAllTransactions();
    }

    // 2. Search Transactions (Auto-Logs the search)
    @GetMapping("/search")
    public List<Transaction> search(@RequestParam String keyword) {
        // Automatically log this action!
        service.logAction("SEARCH_PERFORMED: " + keyword, "Agent"); 
        return service.search(keyword);
    }

    // 3. Filter by Status
    @GetMapping("/filter")
    public List<Transaction> filter(@RequestParam String status) {
        if(status.equals("ALL")) return service.getAllTransactions();
        return service.filterByStatus(status);
    }

    // 4. Create New Transaction
    @PostMapping
    public Transaction create(@RequestBody Transaction t) {
        return service.saveTransaction(t);
    }

    // 5. Get Analytics Stats
    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return service.getStatusStats();
    }

    // 6. NEW: Manual Log Endpoint (For Export button, etc.)
    @PostMapping("/log")
    public void logClientAction(@RequestParam String action) {
        service.logAction(action, "Agent");
    }

    // ... existing code ...

    // 7. Process Refund
    @PostMapping("/{id}/refund")
    public Transaction refundTransaction(@PathVariable Long id) {
        return service.processRefund(id);
    }

    // 8. Mark as Fraud
    @PostMapping("/{id}/fraud")
    public Transaction flagFraud(@PathVariable Long id) {
        return service.markAsFraud(id);
    }
}