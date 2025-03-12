package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.PersonProfile;
import com.example.demo.model.User;
import com.example.demo.service.PersonProfileService;

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

    @PostMapping("/save")
    public void saveProfile(PersonProfile personProfile) {
        personProfileService.saveProfile(personProfile);
    }

}
