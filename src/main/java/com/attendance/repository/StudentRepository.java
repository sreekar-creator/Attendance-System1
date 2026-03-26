package com.attendance.repository;

import com.attendance.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Custom query to find by roll number if necessary
    Student findByRollNumber(String rollNumber);
}
