package com.attendance.repository;

import com.attendance.entity.ReportMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReportMessageRepository extends JpaRepository<ReportMessage, Long> {
    List<ReportMessage> findAllByOrderBySentAtDesc();
    List<ReportMessage> findByStudentIdOrderBySentAtDesc(Long studentId);
}
