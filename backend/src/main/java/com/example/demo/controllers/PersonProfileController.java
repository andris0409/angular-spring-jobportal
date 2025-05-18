package com.example.demo.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.PersonProfileDto;
import com.example.demo.dto.JobDto;
import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.Job;
import com.example.demo.model.PersonProfile;
import com.example.demo.model.User;
import com.example.demo.service.PersonProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/person")
public class PersonProfileController {

    @Autowired
    private PersonProfileService personProfileService;

    @GetMapping("/profile")
    public PersonProfileDto getProfile(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return personProfileService.getProfile(user);
    }

    @GetMapping("/all-profiles")
    public List<PersonProfileDto> getAllProfiles(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return personProfileService.getAllProfiles(user);
    }

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> saveProfile(
            Authentication authentication,
            @RequestPart("personProfile") String personProfileJson,
            @RequestPart("cv") MultipartFile cv) {

        try {
            User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
            ObjectMapper mapper = new ObjectMapper();
            PersonProfile personProfile = mapper.readValue(personProfileJson, PersonProfile.class);
            personProfile.setCv(cv.getBytes());
            personProfileService.saveProfile(user, personProfile);
            return ResponseEntity.ok("Profile saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving profile: " + e.getMessage());
        }
    }

    @GetMapping("/cv")
    public ResponseEntity<byte[]> downloadCv(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        byte[] cvData = personProfileService.getCvDataForUser(user);

        if (cvData == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"cv.pdf\"")
                .body(cvData);
    }

    @PostMapping("/save-job/{jobId}")
    public ResponseEntity<String> saveJobForPerson(Authentication authentication, @PathVariable Long jobId) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        personProfileService.saveJobForPerson(user, jobId);
        return ResponseEntity.ok("Job saved successfully!");
    }

    @Transactional
    @DeleteMapping("/unsave-job/{jobId}")
    public ResponseEntity<String> deleteJobForPerson(Authentication authentication, @PathVariable Long jobId) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        personProfileService.deleteSavedJobForPerson(user, jobId);
        return ResponseEntity.ok("Job unsaved successfully!");
    }

    @Transactional
    @GetMapping("/get-saved-jobs")
    public List<JobDto> getSavedJobsForPerson(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return personProfileService.getSavedJobsForPerson(user);
    }

}
