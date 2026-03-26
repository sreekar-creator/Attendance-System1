package com.attendance.repository;

import com.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // Find all attendance records for a specific date
    List<Attendance> findByDate(LocalDate date);

    // Find attendance records for a specific student
    List<Attendance> findByStudentId(Long studentId);

    // Check if a student already has attendance marked for a specific date
    Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);
    
    // Count attendance status by student
    long countByStudentIdAndStatus(Long studentId, String status);
    
    // Total count of attendance records for student
    long countByStudentId(Long studentId);
}
