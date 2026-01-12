package com.payment.dashboard.repository;

import com.payment.dashboard.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // 1. Basic Status Filter
    List<Transaction> findByStatus(String status);

    // 2. ADVANCED SEARCH: Checks ID, Email, OR Merchant
    @Query("SELECT t FROM Transaction t WHERE " +
           "LOWER(t.transactionId) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.customerEmail) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.merchant) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Transaction> searchByKeyword(String keyword);

    // --- ANALYTICS FEATURES ---

    // 3. Total Revenue (Sum of amounts for SUCCESS transactions)
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = 'SUCCESS'")
    Double getTotalRevenue();

    // 4. Count Pending Transactions (For KPI Card)
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = 'PENDING'")
    Long countPending();

    // 5. Top Failure Reasons (For Bar Chart)
    @Query("SELECT t.failureReason, COUNT(t) FROM Transaction t WHERE t.status = 'FAILED' GROUP BY t.failureReason")
    List<Object[]> getFailureStats();
    
    // --- DYNAMIC TIME RANGE TRENDS (NEW FEATURES) ---

    // 6. Trend for Last 7 Days (Default)
    @Query(value = "SELECT DATE(timestamp) as date, COUNT(*) as count FROM transactions WHERE timestamp >= NOW() - INTERVAL 7 DAY GROUP BY DATE(timestamp) ORDER BY date ASC", nativeQuery = true)
    List<Object[]> getTrend7Days();

    // 7. Trend for Last 30 Days
    @Query(value = "SELECT DATE(timestamp) as date, COUNT(*) as count FROM transactions WHERE timestamp >= NOW() - INTERVAL 30 DAY GROUP BY DATE(timestamp) ORDER BY date ASC", nativeQuery = true)
    List<Object[]> getTrend30Days();

    // 8. Trend for Last 24 Hours (Grouped by Hour)
    @Query(value = "SELECT DATE_FORMAT(timestamp, '%H:00') as hour, COUNT(*) as count FROM transactions WHERE timestamp >= NOW() - INTERVAL 24 HOUR GROUP BY hour ORDER BY hour ASC", nativeQuery = true)
    List<Object[]> getTrend24Hours();
}