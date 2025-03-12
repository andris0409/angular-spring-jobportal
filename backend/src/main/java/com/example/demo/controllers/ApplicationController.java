package com.example.demo.controllers;

import java.util.Collections;
import java.util.List;
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

import com.example.demo.model.Application;
import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.Job;
import com.example.demo.model.User;
import com.example.demo.service.ApplicationService;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addApplication(@RequestBody Long jobId, Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        applicationService.addApplication(user.getId(), jobId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Application added successfully"));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteApplication(@PathVariable Long id, Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        applicationService.deleteApplication(user, id);
        return ResponseEntity.ok("Application deleted successfully");

    }

    @GetMapping("/get/{id}")
    public Application getApplication(@PathVariable Long id, Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return applicationService.getApplication(user, id);
    }

    @GetMapping("/getMyApplications")
    public List<Application> getMyApplications(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return applicationService.getMyApplications(user);
    }

    @GetMapping("/getUsers")
    public void getUsers(@RequestBody Job job, Authentication authentication) {
        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        applicationService.getUsers(userId, job);
    }
}
