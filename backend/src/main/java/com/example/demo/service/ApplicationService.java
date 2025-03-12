package com.example.demo.service;

import java.util.List;

import org.hibernate.usertype.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.BeanDefinitionDsl.Role;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.model.Application;
import com.example.demo.model.Job;
import com.example.demo.model.User;
import com.example.demo.repository.ApplicationRepository;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.UserRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public void addApplication(Long userId, Long jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != com.example.demo.model.User.Role.PERSON) {
            throw new RuntimeException("Only persons can apply for jobs");
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByUserAndJob(user, job)) {
            throw new RuntimeException("You have already applied for this job");
        }

        Application application = new Application();
        application.setUser(user);
        application.setJob(job);
        applicationRepository.save(application);
        job.getApplications().add(application);
        jobRepository.save(job);
    }

    public void deleteApplication(User user, Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!application.getUser().getId().equals(user.getId())
                && user.getRole() != com.example.demo.model.User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You are not authorized to delete this application");
        }
        applicationRepository.deleteById(id);
    }

    // Lehet ez így nem lesz az igazi
    public Application getApplication(User user, Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!application.getUser().getId().equals(user.getId())
                && user.getRole() != com.example.demo.model.User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You are not authorized to view this application");
        }
        return applicationRepository.findById(id).orElse(new Application());
    }

    public List<Application> getMyApplications(User user) {
        if (user.getRole() != com.example.demo.model.User.Role.PERSON) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only available for persons");
        }
        List<Application> applications = applicationRepository.findByUser(user);
        if (applications.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No applications found");
        }
        return applications;
    }

    public List<User> getUsers(Long userId, Job job) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != com.example.demo.model.User.Role.COMPANY) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only available for companies");
        }
        return applicationRepository.findByJob(job);
    }
}
