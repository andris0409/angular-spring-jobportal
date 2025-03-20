package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.PersonProfile;
import com.example.demo.model.User;
import com.example.demo.service.PersonProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/person")
public class PersonProfileController {

    @Autowired
    private PersonProfileService personProfileService;

    @GetMapping("/profile")
    public PersonProfile getProfile(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return personProfileService.getProfile(user.getId());
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

}
