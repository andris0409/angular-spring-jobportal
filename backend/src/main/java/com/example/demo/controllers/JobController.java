package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.JobDto;
import com.example.demo.dto.PersonProfileDto;
import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.Job;
import com.example.demo.model.JobSpecification;
import com.example.demo.model.User;
import com.example.demo.repository.JobRepository;
import com.example.demo.service.JobService;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private JobRepository jobRepository;

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
    public JobDto getJob(@PathVariable Long id) {
        return jobService.getJob(id);
    }

    @GetMapping("/get-all")
    public List<JobDto> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/filteredJobs")
    public ResponseEntity<Page<JobDto>> getFilteredJobs(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String selectedType,
            @RequestParam(required = false) String selectedLocation,
            @RequestParam(required = false) String selectedCategory,
            Pageable pageable) {

        Specification<Job> spec = JobSpecification.filter(searchTerm, selectedType, selectedLocation, selectedCategory);
        Page<JobDto> jobs = jobService.getFilteredJobs(spec, pageable);
        return ResponseEntity.ok(jobs);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateJob(@PathVariable Long id, @RequestBody Job updatedJob) {
        jobService.updateJob(id, updatedJob);
        return ResponseEntity.ok("Job updated successfully");
    }

    @GetMapping("/get-by-company")
    public List<JobDto> getJobsByCompanyId(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        if (user.getRole().equals(User.Role.COMPANY)) {
            return jobService.getJobsByCompanyId(user.getId());
        } else {
            throw new IllegalArgumentException("You are not authorized to view this resource");
        }
    }

    @GetMapping("/get-applications/{id}")
    public List<PersonProfileDto> getApplications(@PathVariable Long id) {
        return jobService.getApplications(id);
    }

}
