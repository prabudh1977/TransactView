package com.payment.dashboard.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String transactionId;
    private String customerEmail;
    private Double amount;
    private String status; // SUCCESS, PENDING, FAILED
    private String paymentMethod;
    
    // NEW FIELDS for Requirements
    private String merchant;      // e.g., "Amazon", "Uber"
    private String refundStatus;  // e.g., "NONE", "REQUESTED", "REFUNDED"
    private String failureReason; // e.g., "Insufficient Funds"
    
    private LocalDateTime timestamp;
}