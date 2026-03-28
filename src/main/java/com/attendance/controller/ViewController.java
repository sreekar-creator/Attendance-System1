package com.attendance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    // Forward all navigation to index.html so React Router can handle it
    @GetMapping({"/", "/login", "/dashboard", "/students", "/add-student", "/attendance", "/report", "/settings"})
    public String index() {
        return "forward:/index.html";
    }
}
