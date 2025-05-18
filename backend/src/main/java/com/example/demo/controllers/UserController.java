package com.example.demo.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequestDto;
import com.example.demo.jwt.JwtUtil;
import com.example.demo.model.User;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        service.createUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequestDto loginRequestDto) {

        service.loginUser(loginRequestDto);

        String token = jwtUtil.generateToken(loginRequestDto.getUsername());
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", loginRequestDto.getUsername());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/role")
    public ResponseEntity<String> getRole(Authentication authentication) {
        return ResponseEntity.ok(service.getRole(authentication));
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId, Authentication authentication) {
        service.deleteUser(userId, authentication);
        return ResponseEntity.ok("User deleted successfully");
    }
}
