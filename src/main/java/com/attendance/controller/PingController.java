package com.attendance.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PingController {

    /**
     * Minimal endpoint to keep the Render-hosted application active.
     * Returns "pong" to verify the server is running.
     * 
     * @return String "pong"
     */
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
