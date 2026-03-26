# Attendance Management System

This is a complete full-stack Attendance Management System built with Spring Boot (Java), MySQL, HTML, CSS, and JS. 

## Features
- **Frontend**: Clean, modern UI without external frameworks (Vanilla JS, HTML, Custom CSS).
- **Backend**: Spring Boot MVC mapping REST endpoints and serving static assets.
- **Database**: MySQL over JPA configuring custom repositories.
- **Functionality**:
    - Teacher Authentication
    - Comprehensive Dashboard Metrics
    - Student Creation and Deletion
    - Daily Attendance Logging (Present/Absent)
    - Detailed reporting and historical percentage calculation per student.

## Prerequisites
1. **Java 17** initialized.
2. **Maven** installed (`mvn`).
3. **MySQL** running locally on port 3306.

## Setup Instructions

1. **Database Config:**
   Open `src/main/resources/application.properties` and verify your MySQL root password is correct (it is set to `root` by default). The application is configured to create the database automatically (`attendance_db`).

2. **Run The Application:**
   Navigate into this project directory via terminal:
   ```bash
   cd Desktop\anitigravity_project
   ```

   Then execute:
   ```bash
   mvn spring-boot:run
   ```

   *(You can also optionally run this project through the VS Code Spring Boot Extension by clicking "Run" in your `AttendanceApplication.java` file).*

3. **Access Application:**
   Once Spring Boot starts (on port 8080), open your browser and go to:
   [http://localhost:8080/](http://localhost:8080/)

4. **Login Credentials:**
   The application preloads a dummy teacher on startup. 
   - **Username**: teacher
   - **Password**: password

Enjoy managing attendance!
