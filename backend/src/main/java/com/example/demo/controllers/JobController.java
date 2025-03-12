package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.Job;
import com.example.demo.model.User;
import com.example.demo.service.JobService;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping("/add")
    public void addJob(@RequestBody Job job, Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        jobService.addJob(user, job);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
    }

    @GetMapping("/get/{id}")
    public Job getJob(@PathVariable Long id) {
        return jobService.getJob(id);
    }

    @GetMapping("/get-all")
    public List<Job> getJobs() {
        return jobService.getJobs();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job updatedJob) {
        Job job = jobService.updateJob(id, updatedJob);
        return ResponseEntity.ok(job);
    }

    @GetMapping("/get-by-company")
    public List<Job> getJobsByCompanyId(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        if (user.getRole().equals(User.Role.COMPANY)) {
            return jobService.getJobsByCompanyId(user.getId());
        } else {
            throw new IllegalArgumentException("You are not authorized to view this resource");
        }
    }

    @GetMapping("/get-applications/{id}")
    public List<User> getApplications(@PathVariable Long id) {
        return jobService.getApplications(id);
    }

}
