package com.example.demo.service;

import java.lang.classfile.ClassFile.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.JobDto;
import com.example.demo.dto.PersonProfileDto;
import com.example.demo.model.Application;
import com.example.demo.model.Job;
import com.example.demo.model.PersonProfile;
import com.example.demo.model.User;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.PersonProfileRepository;

import jakarta.transaction.Transactional;
import lombok.val;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PersonProfileRepository personProfileRepository;

    public void addJob(User user, Job job) {
        if (user.getRole() != User.Role.COMPANY) {
            throw new RuntimeException("Only companies can add jobs");
        }
        job.setCompany(user);
        jobRepository.save(job);
    }

    @Transactional
    public void deleteJob(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        List<PersonProfile> profiles = personProfileRepository.findAllBySavedJobs_Id(jobId);
        profiles.forEach(profile -> profile.getSavedJobs().remove(job));

        jobRepository.delete(job);
    }

    public JobDto getJob(Long id) {
        Job job = jobRepository.findById(id).orElse(new Job());
        return new JobDto(job);
    }

    public List<JobDto> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        List<JobDto> jobDtos = new ArrayList<>();
        for (Job job : jobs) {
            jobDtos.add(new JobDto(job));
        }
        return jobDtos;
    }

    public void updateJob(Long id, Job job) {
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
        jobRepository.save(jobToUpdate);
    }

    public List<JobDto> getJobsByCompanyId(Long companyId) {
        List<Job> jobs = jobRepository.findByCompanyId(companyId);
        List<JobDto> jobDtos = new ArrayList<>();
        for (Job job : jobs) {
            jobDtos.add(new JobDto(job));
        }
        return jobDtos;
    }

    @Transactional
    public List<PersonProfileDto> getApplications(Long jobId) {
        Optional<Job> job = jobRepository.findById(jobId);
        if (!job.isPresent()) {
            throw new RuntimeException("Job not found");
        }
        val applications = job.get().getApplications();
        List<User> users = new ArrayList<>();
        for (Application application : applications) {
            users.add(application.getUser());
        }
        List<PersonProfileDto> profiles = new ArrayList<>();
        for (User user : users) {
            Optional<PersonProfile> profile = personProfileRepository.findByUserId(user.getId());
            if (profile.isPresent()) {
                profiles.add(new PersonProfileDto(profile.get()));
            }
        }
        return profiles;
    }
}
