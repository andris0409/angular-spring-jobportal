package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.CompanyProfile;
import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.User;
import com.example.demo.service.CompanyProfileService;

@RestController
@RequestMapping("/api/v1/")
public class CompanyProfileController {

    @Autowired
    private CompanyProfileService companyProfileService;

    @GetMapping("/profile")
    public CompanyProfile getProfile(Authentication authentication) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        return companyProfileService.getProfile(user.getId());
    }

    @PostMapping("/save")
    public void saveProfile(CompanyProfile companyProfile) {
        companyProfileService.saveProfile(companyProfile);
    }

    @PostMapping("/addcomment")
    public void addComment(Long companyId, String comment) {
        companyProfileService.addComment(companyId, comment);
    }

}
