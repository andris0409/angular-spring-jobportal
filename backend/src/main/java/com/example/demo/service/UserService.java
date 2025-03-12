package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginRequestDto;
import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("User already exist");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public User loginUser(LoginRequestDto loginRequestDto) {
        Optional<User> userOptional = userRepository.findByUsernameOrEmail(loginRequestDto.getUsername(),
                loginRequestDto.getUsername());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Username or password invalid");
        }
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (!passwordEncoder.matches(loginRequestDto.getPassword(),
                    user.getPassword())) {
                throw new RuntimeException("username or password invalid");
            }

            return user;
        }
        return new User();
    }

    public String getRole(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return user.getRole().toString();
    }

}
