package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.CompanyProfile;
import com.example.demo.repository.CompanyProfileRepository;

@Service
public class CompanyProfileService {

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    public void saveProfile(CompanyProfile companyProfile) {
        companyProfileRepository.save(companyProfile);
    }

    public CompanyProfile getProfile(Long userId) {
        return companyProfileRepository.findByUserId(userId).orElse(null);
    }

    public void addComment(Long companyId, String comment) {
        CompanyProfile companyProfile = companyProfileRepository.findByUserId(companyId).orElse(null);
        if (companyProfile != null) {
            companyProfile.getComments().add(comment);
            companyProfileRepository.save(companyProfile);
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }
}
