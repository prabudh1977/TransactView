package com.payment.dashboard.repository;
import com.payment.dashboard.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}