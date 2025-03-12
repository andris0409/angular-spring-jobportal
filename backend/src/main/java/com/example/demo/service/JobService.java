package com.example.demo.service;

import java.lang.classfile.ClassFile.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Application;
import com.example.demo.model.Job;
import com.example.demo.model.User;
import com.example.demo.repository.JobRepository;

import lombok.val;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public void addJob(User user, Job job) {
        if (user.getRole() != User.Role.COMPANY) {
            throw new RuntimeException("Only companies can add jobs");
        }
        job.setCompany(user);
        jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    public Job getJob(Long id) {
        return jobRepository.findById(id).orElse(new Job());
    }

    public List<Job> getJobs() {
        return jobRepository.findAll();
    }

    public Job updateJob(Long id, Job job) {
        Optional<Job> jobOptional = jobRepository.findById(id);
        if (!jobOptional.isPresent()) {
            throw new RuntimeException("Job not found");
        }
        Job jobToUpdate = jobOptional.get();
        jobToUpdate.setTitle(job.getTitle());
        jobToUpdate.setDescription(job.getDescription());
        jobToUpdate.setType(job.getType());
        jobToUpdate.setCategory(job.getCategory());
        jobToUpdate.setLocation(job.getLocation());
        return jobRepository.save(jobToUpdate);
    }

    public List<Job> getJobsByCompanyId(Long companyId) {
        return jobRepository.findByCompanyId(companyId);
    }

    public List<User> getApplications(Long jobId) {
        Optional<Job> job = jobRepository.findById(jobId);
        if (!job.isPresent()) {
            throw new RuntimeException("Job not found");
        }
        val applications = job.get().getApplications();
        List<User> users = new ArrayList<>();
        for (Application application : applications) {
            users.add(application.getUser());
        }
        return users;
    }
}
