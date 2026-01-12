package com.payment.dashboard.controller;

import com.payment.dashboard.model.AuditLog;
import com.payment.dashboard.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*") // Allow React to access
public class AuditController {

    @Autowired
    private AuditLogRepository repository;

    @GetMapping
    public List<AuditLog> getAllLogs() {
        // Return all logs, newest first (sorting logic can be added here)
        return repository.findAll();
    }
}