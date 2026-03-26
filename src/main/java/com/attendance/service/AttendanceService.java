package com.attendance.service;

import com.attendance.entity.Attendance;
import com.attendance.entity.ReportMessage;
import com.attendance.entity.Student;
import com.attendance.entity.Teacher;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.ReportMessageRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AttendanceService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ReportMessageRepository reportMessageRepository;

    // --- Admin Login ---
    public boolean authenticateAdmin(String username, String password) {
        return "admin".equals(username) && "admin123".equals(password);
    }

    // --- Teacher Login ---
    public Teacher authenticateTeacher(String username, String password) {
        Teacher teacher = teacherRepository.findByUsername(username);
        // Fallback for legacy hardcoded login if they haven't set up the DB fully yet
        if ("teacher".equals(username) && "password".equals(password)) {
            if (teacher == null) {
                teacher = new Teacher("Default Teacher", "All", "teacher", "password");
                return teacherRepository.save(teacher);
            }
            return teacher;
        }

        if (teacher != null && teacher.getPassword().equals(password)) {
            return teacher;
        }
        return null;
    }

    // --- Teacher Operations ---
    public Teacher addTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public boolean changeTeacherPassword(Long teacherId, String newPassword) {
        Optional<Teacher> opt = teacherRepository.findById(teacherId);
        if (opt.isPresent()) {
            Teacher t = opt.get();
            t.setPassword(newPassword);
            teacherRepository.save(t);
            return true;
        }
        return false;
    }

    // --- Report Messages ---
    public ReportMessage addReportMessage(ReportMessage message) {
        return reportMessageRepository.save(message);
    }

    public List<ReportMessage> getAllReportMessages() {
        return reportMessageRepository.findAllByOrderBySentAtDesc();
    }

    public void markReportAsRead(Long id) {
        Optional<ReportMessage> opt = reportMessageRepository.findById(id);
        if (opt.isPresent()) {
            ReportMessage msg = opt.get();
            msg.setRead(true);
            reportMessageRepository.save(msg);
        }
    }

    // --- Student Login ---
    public Student authenticateStudent(String name, String rollNumber) {
        Student student = studentRepository.findByRollNumber(rollNumber);
        if (student != null && student.getName().equalsIgnoreCase(name.trim())) {
            return student;
        }
        return null;
    }

    // --- Student Operations ---
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    // --- Attendance Operations ---
    public Attendance markAttendance(Long studentId, LocalDate date, String status) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            throw new RuntimeException("Student not found");
        }

        // Check if already marked for this date
        Optional<Attendance> existing = attendanceRepository.findByStudentIdAndDate(studentId, date);
        if (existing.isPresent()) {
            Attendance att = existing.get();
            att.setStatus(status);
            return attendanceRepository.save(att);
        }

        Attendance newAttendance = new Attendance(studentOpt.get(), date, status);
        return attendanceRepository.save(newAttendance);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    // --- Statistics ---
    public Map<String, Object> getStudentAttendanceStats(Long studentId) {
        long totalDays = attendanceRepository.countByStudentId(studentId);
        long presentDays = attendanceRepository.countByStudentIdAndStatus(studentId, "Present");
        
        double percentage = totalDays == 0 ? 0 : ((double) presentDays / totalDays) * 100;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDays", totalDays);
        stats.put("presentDays", presentDays);
        stats.put("percentage", Math.round(percentage * 100.0) / 100.0); // 2 decimal places

        return stats;
    }

    public Map<String, Object> getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long todayAttendanceCount = attendanceRepository.findByDate(LocalDate.now()).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalTeachers", totalTeachers);
        stats.put("todayAttendanceCount", todayAttendanceCount);
        return stats;
    }
}
