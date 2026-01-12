package com.payment.dashboard.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;       // e.g., "VIEWED_DETAILS", "EXPORTED_REPORT"
    private String username;     // e.g., "Agent_001"
    private LocalDateTime timestamp;
}