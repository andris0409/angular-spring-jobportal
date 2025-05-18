package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.example.demo.dto.CommentDto;
import com.example.demo.dto.CompanyProfileDto;
import com.example.demo.model.CompanyProfile;
import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.User;
import com.example.demo.service.CompanyProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/company")
public class CompanyProfileController {

    @Autowired
    private CompanyProfileService companyProfileService;

    @GetMapping("/{id}")
    public CompanyProfileDto getCompanyById(@PathVariable Long id) {
        return companyProfileService.getCompanyById(id);
    }

    @GetMapping("/profile")
    public CompanyProfileDto getProfile(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        CompanyProfileDto dto = companyProfileService.getProfile(user.getId());
        return dto;
    }

    @GetMapping("/all-profiles")
    public List<CompanyProfileDto> getAllProfiles(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return companyProfileService.getAllProfiles(user);
    }

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> saveCompanyProfile(
            Authentication authentication,
            @RequestPart("companyProfile") String companyProfileJson,
            @RequestPart(value = "logo", required = false) MultipartFile logoFile) {

        try {
            User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

            ObjectMapper mapper = new ObjectMapper();
            CompanyProfile companyProfile = mapper.readValue(companyProfileJson, CompanyProfile.class);

            companyProfile.setUser(user);

            if (logoFile != null && !logoFile.isEmpty()) {
                companyProfile.setLogo(logoFile.getBytes());
            }

            if (companyProfile.getComments() == null) {
                companyProfile.setComments(new ArrayList<>());
            }

            companyProfileService.saveProfile(companyProfile);

            return ResponseEntity.ok("Company profile saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving company profile: " + e.getMessage());
        }
    }

    @PostMapping("/addcomment")
    public ResponseEntity<String> addComment(@RequestBody CommentDto commentDto) {
        companyProfileService.addComment(commentDto.getCompanyId(), commentDto.getComment());
        return ResponseEntity.ok("Comment added successfully!");
    }

    @DeleteMapping("/deletecomment")
    public ResponseEntity<String> deleteComment(Authentication authentication, @RequestBody CommentDto commentDto) {
        companyProfileService.deleteComment(authentication, commentDto.getCompanyId(), commentDto.getComment());
        return ResponseEntity.ok("Comment deleted successfully!");
    }

    @GetMapping("/getcomments/{companyId}")
    public List<String> getComments(@PathVariable Long companyId) {
        List<String> comments = companyProfileService.getComments(companyId);
        return comments;
    }

}
