package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import javax.management.relation.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.PersonProfileDto;
import com.example.demo.dto.JobDto;
import com.example.demo.model.Job;
import com.example.demo.model.PersonProfile;
import com.example.demo.model.User;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.PersonProfileRepository;

@Service
public class PersonProfileService {

    @Autowired
    private PersonProfileRepository personProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Transactional
    public void saveProfile(User user, PersonProfile personProfile) {
        personProfile.setUser(user);
        Long userId = personProfile.getUser().getId();
        if (userId != null) {
            Optional<PersonProfile> optional = personProfileRepository.findByUserId(userId);
            if (optional.isPresent()) {
                PersonProfile existing = optional.get();
                existing.setFullName(personProfile.getFullName());
                existing.setEmail(personProfile.getEmail());
                existing.setPhone(personProfile.getPhone());
                existing.setAddress(personProfile.getAddress());
                existing.setBirthDate(personProfile.getBirthDate());
                existing.setCv(personProfile.getCv());
                existing.setUser(user);
                personProfile = existing;
            }
        }
        personProfileRepository.save(personProfile);
    }

    @Transactional
    public PersonProfileDto getProfile(User user) {
        PersonProfile profile = personProfileRepository.findByUserId(user.getId()).orElse(null);
        profile.setCv(getCvDataForUser(user));
        return mapToDto(profile);
    }

    @Transactional
    public List<PersonProfileDto> getAllProfiles(User user) {
        if (!user.getRole().equals(com.example.demo.model.User.Role.ADMIN)) {
            throw new RuntimeException("Only admin can view all profiles");
        }
        List<PersonProfile> profiles = personProfileRepository.findAll();
        return profiles.stream().map(this::mapToDto).toList();
    }

    private PersonProfileDto mapToDto(PersonProfile profile) {
        PersonProfileDto profileDto = new PersonProfileDto();
        profileDto.setId(profile.getUser().getId());
        profileDto.setFullName(profile.getFullName());
        profileDto.setEmail(profile.getEmail());
        profileDto.setPhone(profile.getPhone());
        profileDto.setAddress(profile.getAddress());
        profileDto.setBirthDate(profile.getBirthDate());
        profileDto.setCv(profile.getCv());
        return profileDto;
    }

    @Transactional
    public byte[] getCvDataForUser(User user) {
        PersonProfile profile = personProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        byte[] cvData = profile.getCv();
        return cvData;
    }

    @Transactional
    public void saveJobForPerson(User user, Long jobId) {
        PersonProfile profile = personProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile must be created first"));
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        if (!profile.getSavedJobs().contains(job)) {
            profile.getSavedJobs().add(job);
            personProfileRepository.save(profile);
            job.setSaved(true);
            jobRepository.save(job);
        } else {
            throw new RuntimeException("Job already saved");
        }
    }

    public void deleteSavedJobForPerson(User user, Long jobId) {
        PersonProfile profile = personProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        profile.getSavedJobs().remove(job);
        personProfileRepository.save(profile);
        job.setSaved(false);
        jobRepository.save(job);
    }

    public List<JobDto> getSavedJobsForPerson(User user) {
        PersonProfile profile = personProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        List<JobDto> savedJobs = mapJobsToDto(profile.getSavedJobs());
        return savedJobs;
    }

    private List<JobDto> mapJobsToDto(List<Job> savedJobs) {
        return savedJobs.stream()
                .map(job -> {
                    JobDto dto = new JobDto();
                    dto.setId(job.getId());
                    dto.setTitle(job.getTitle());
                    dto.setLocation(job.getLocation());
                    dto.setType(job.getType());
                    dto.setDescription(job.getDescription());
                    dto.setCategory(job.getCategory());
                    dto.setCompanyName(job.getCompany().getUsername());
                    dto.setCompanyId(Long.toString(job.getCompany().getId()));
                    dto.setSaved(job.isSaved());
                    return dto;
                })
                .toList();
    }

}
