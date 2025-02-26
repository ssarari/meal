package com.example.test2.controller;

import com.example.test2.dto.AddressForm;
import com.example.test2.dto.UsersForm;
import com.example.test2.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;


/*
 * RegisterController - Mapping List : 회원가입 기능
 * @RequestMapping("/register")
 * 1. 회원가입 버튼 클릭시 작동 : /add
 * 2. 회원정보 수정 완료 버튼 시 : /update
 */


@Slf4j
@Controller
@RequestMapping("/register")
public class RegisterController {
    @Autowired
    private UserService userService;

    // 1. 회원가입 버튼 클릭시 작동
    @PostMapping("/add")
    public String register(UsersForm usersform, AddressForm addressForm){
        userService.registerUser(usersform, addressForm);
        return "redirect:/loginpage";
    }


    // 2. 회원정보 수정 완료 버튼 클릭시
    @PostMapping("/update")
    public String update(UsersForm usersform){
        userService.updateUser(usersform);

        return "/main";
    }

}
