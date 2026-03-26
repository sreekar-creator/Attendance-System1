package com.attendance.controller;

import com.attendance.entity.Attendance;
import com.attendance.entity.ReportMessage;
import com.attendance.entity.Student;
import com.attendance.entity.Teacher;
import com.attendance.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private AttendanceService attendanceService;

    // Student Endpoints
    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return attendanceService.getAllStudents();
    }

    @PostMapping("/students")
    public Student addStudent(@RequestBody Student student) {
        return attendanceService.addStudent(student);
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        attendanceService.deleteStudent(id);
        return ResponseEntity.ok().build();
    }

    // Attendance Endpoints
    @PostMapping("/attendance/mark")
    public ResponseEntity<?> markAttendance(@RequestParam Long studentId, 
                                            @RequestParam String date, 
                                            @RequestParam String status) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            Attendance attendance = attendanceService.markAttendance(studentId, localDate, status);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/attendance")
    public ResponseEntity<?> getAttendanceByDate(@RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<Attendance> list = attendanceService.getAttendanceByDate(localDate);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Statistics Endpoints
    @GetMapping("/students/{id}/stats")
    public ResponseEntity<Map<String, Object>> getStudentStats(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceStats(id));
    }

    @GetMapping("/stats/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(attendanceService.getDashboardStats());
    }

    // Login Endpoint (Teacher)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        Teacher teacher = attendanceService.authenticateTeacher(username, password);
        if (teacher != null) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "teacherId", teacher.getId(),
                "teacherName", teacher.getName()
            ));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid credentials"));
    }

    // Student Login Endpoint
    @PostMapping("/student/login")
    public ResponseEntity<?> studentLogin(@RequestParam String name, @RequestParam String rollNumber) {
        Student student = attendanceService.authenticateStudent(name, rollNumber);
        if (student != null) {
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Login successful", 
                "studentId", student.getId(),
                "studentName", student.getName()
            ));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid Student credentials"));
    }

    // Admin Login Endpoint
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestParam String username, @RequestParam String password) {
        if (attendanceService.authenticateAdmin(username, password)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Admin Login successful"));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid Admin credentials"));
    }

    // Teacher Management (Admin)
    @GetMapping("/teachers")
    public List<Teacher> getAllTeachers() {
        return attendanceService.getAllTeachers();
    }

    @PostMapping("/teachers")
    public Teacher addTeacher(@RequestBody Teacher teacher) {
        return attendanceService.addTeacher(teacher);
    }

    // Teacher Password Change
    @PutMapping("/teacher/password")
    public ResponseEntity<?> changeTeacherPassword(@RequestParam Long teacherId, @RequestParam String newPassword) {
        boolean success = attendanceService.changeTeacherPassword(teacherId, newPassword);
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Password changed successfully"));
        }
        return ResponseEntity.status(400).body(Map.of("success", false, "message", "Teacher not found"));
    }

    // Reports Endpoints
    @PostMapping("/reports")
    public ReportMessage addReport(@RequestBody ReportMessage message) {
        return attendanceService.addReportMessage(message);
    }

    @GetMapping("/reports")
    public List<ReportMessage> getAllReports() {
        return attendanceService.getAllReportMessages();
    }

    @PutMapping("/reports/{id}/read")
    public ResponseEntity<?> markReportRead(@PathVariable Long id) {
        attendanceService.markReportAsRead(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
