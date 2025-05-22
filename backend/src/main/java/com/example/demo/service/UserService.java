package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginRequestDto;
import com.example.demo.model.Application;
import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.Job;
import com.example.demo.model.PersonProfile;
import com.example.demo.model.User;
import com.example.demo.model.User.Role;
import com.example.demo.repository.ApplicationRepository;
import com.example.demo.repository.CompanyProfileRepository;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.PersonProfileRepository;
import com.example.demo.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PersonProfileRepository personProfileRepository;

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PersonProfileService personProfileService;

    public void createUser(User user) {
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Admin users cannot be created");
        }
        if (userRepository.findByUsernameOrEmail(user.getUsername(), user.getEmail()).isPresent()) {
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

    @Transactional
    public boolean deleteUser(Long id, Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        if (user.getRole().equals(com.example.demo.model.User.Role.ADMIN)) {
            Optional<User> userToDeleteOptional = userRepository.findById(id);
            if (userToDeleteOptional.isEmpty()) {
                throw new RuntimeException("User not found");
            }
            User userToDelete = userToDeleteOptional.get();
            if (userToDelete.getRole().equals(com.example.demo.model.User.Role.PERSON)) {
                personProfileRepository.deleteByUserId(id);
            }
            if (userToDelete.getRole().equals(com.example.demo.model.User.Role.COMPANY)) {
                companyProfileRepository.deleteByUserId(id);
                List<Job> jobs = jobRepository.findByCompanyId(id);
                for (Job job : jobs) {
                    List<Application> applications = applicationRepository.findByJobId(job.getId());
                    for (Application application : applications) {
                        applicationRepository.delete(application);
                    }
                    List<PersonProfile> usersWithJobSaved = personProfileRepository.findAllBySavedJobsContains(job);
                    for (PersonProfile user1 : usersWithJobSaved) {
                        user1.getSavedJobs().remove(job);
                    }
                    personProfileRepository.saveAll(usersWithJobSaved);
                    jobRepository.delete(job);
                }
            }
            if (userToDelete.getRole().equals(com.example.demo.model.User.Role.ADMIN)) {
                throw new RuntimeException("You cannot delete an admin user");
            }
            List<Application> applications = applicationRepository.findByUserId(id);
            for (Application application : applications) {
                applicationRepository.delete(application);
            }
            userRepository.deleteById(id);
            return true;
        } else {
            throw new RuntimeException("You are not authorized to delete this user");
        }
    }
}
