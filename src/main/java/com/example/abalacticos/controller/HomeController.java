package com.example.abalacticos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class HomeController {

    @RequestMapping(value = "/**/{[path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}