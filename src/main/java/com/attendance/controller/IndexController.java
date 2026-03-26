package com.attendance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {

    // Forward all non-API and non-file paths to the React index.html
    @RequestMapping(value = { "/", "/{path:[^\\.]*}", "/{path:^(?!api$).*}/**/{subpath:[^\\.]*}" })
    public String getIndex() {
        return "forward:/index.html";
    }
}
