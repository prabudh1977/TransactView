package com.payment.dashboard.controller;

import com.payment.dashboard.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private TransactionRepository repository;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardData(@RequestParam(defaultValue = "7days") String range) {
        Map<String, Object> data = new HashMap<>();

        // 1. KPI Data (Global stats for simplicity, or filter similarly if needed)
        Double revenue = repository.getTotalRevenue();
        Long totalTxns = repository.count();
        Long pending = repository.countPending();
        
        data.put("total_revenue", revenue != null ? revenue : 0.0);
        data.put("total_volume", totalTxns);
        data.put("pending_actions", pending);

        // Success Rate
        long successCount = repository.findByStatus("SUCCESS").size();
        double rate = totalTxns > 0 ? ((double) successCount / totalTxns) * 100 : 0;
        data.put("success_rate", String.format("%.1f", rate));

        // 2. Dynamic Trend Data based on "range"
        List<Object[]> trendRows;
        if ("30days".equals(range)) {
            trendRows = repository.getTrend30Days();
        } else if ("24h".equals(range)) {
            trendRows = repository.getTrend24Hours();
        } else {
            trendRows = repository.getTrend7Days(); // Default
        }

        List<Map<String, Object>> trendData = new ArrayList<>();
        for (Object[] row : trendRows) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", row[0].toString());
            point.put("count", row[1]);
            trendData.add(point);
        }
        data.put("daily_trend", trendData);

        // 3. Failure Reasons
        List<Object[]> failureRows = repository.getFailureStats();
        List<Map<String, Object>> failureData = new ArrayList<>();
        for (Object[] row : failureRows) {
            Map<String, Object> point = new HashMap<>();
            String reason = row[0] == null ? "Unknown Error" : row[0].toString();
            point.put("reason", reason);
            point.put("count", row[1]);
            failureData.add(point);
        }
        if (failureData.isEmpty()) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("reason", "System Healthy");
            empty.put("count", 0);
            failureData.add(empty);
        }
        data.put("failure_reasons", failureData);

        return data;
    }
}