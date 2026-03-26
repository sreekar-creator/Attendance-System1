package com.attendance.repository;

import com.attendance.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Teacher findByName(String name);
    Teacher findByUsername(String username);
}
