package com.example.test2.controller;

import com.example.test2.entity.Users;
import com.example.test2.repository.AddressRepository;
import com.example.test2.repository.UserRepository;
import com.example.test2.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.management.remote.JMXAuthenticator;


@Slf4j
@Controller
public class testController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private AddressRepository addressRepository;

    //    메인 화면 이동
    @CrossOrigin(origins = "http://localhost:9098") // 프록시 서버 url
    @GetMapping("/api/weather")
    public String weather() {
        return "weathertest";
    }

}