package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.hibernate.usertype.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.BeanDefinitionDsl.Role;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.ApplicationDto;
import com.example.demo.dto.PersonProfileDto;
import com.example.demo.model.Application;
import com.example.demo.model.Job;
import com.example.demo.model.PersonProfile;
import com.example.demo.model.User;
import com.example.demo.repository.ApplicationRepository;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.PersonProfileRepository;
import com.example.demo.repository.UserRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PersonProfileRepository personProfileRepository;

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
        if (personProfileRepository.existsByUserId(userId) == false) {
            throw new RuntimeException("You need to create a profile before applying for a job");
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

    public ApplicationDto getApplication(User user, Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!application.getUser().getId().equals(user.getId())
                && user.getRole() != com.example.demo.model.User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You are not authorized to view this application");
        }
        return new ApplicationDto(application);
    }

    public List<ApplicationDto> getMyApplications(User user) {
        if (user.getRole() != com.example.demo.model.User.Role.PERSON) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only available for persons");
        }
        List<Application> applications = applicationRepository.findByUser(user);
        if (applications.isEmpty()) {
            return List.of();
        } else {
            return applications.stream()
                    .map(application -> new ApplicationDto(application))
                    .toList();
        }
    }
}
