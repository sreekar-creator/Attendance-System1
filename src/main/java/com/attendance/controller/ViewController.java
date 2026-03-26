package com.attendance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    // Root path redirects to login
    @GetMapping("/")
    public String index() {
        return "redirect:/login.html";
    }

    // Following endpoints could map if using Thymeleaf.
    // However, since we are using plain HTML in src/main/resources/static, 
    // we let Spring Boot handle mapping HTML files natively.
    // If a user goes to /dashboard, we want them to get /dashboard.html, but typically
    // they just navigate to dashboard.html directly in an MPA without Thymeleaf.
    
    // We can define explicit mappings here just in case!
    @GetMapping("/dashboard")
    public String dashboard() {
        return "forward:/dashboard.html";
    }

    @GetMapping("/students")
    public String students() {
        return "forward:/student-list.html";
    }
}
