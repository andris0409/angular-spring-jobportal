package com.example.demo.service;

import java.lang.classfile.ClassFile.Option;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CompanyProfileDto;
import com.example.demo.model.CompanyProfile;
import com.example.demo.model.CustomUserDetails;
import com.example.demo.model.User;
import com.example.demo.repository.CompanyProfileRepository;

import jakarta.transaction.Transactional;

@Service
public class CompanyProfileService {

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Transactional
    public void saveProfile(CompanyProfile companyProfile) {
        Long userId = companyProfile.getUser().getId();
        if (userId != null) {
            Optional<CompanyProfile> optional = companyProfileRepository.findByUserId(userId);
            if (optional.isPresent()) {
                CompanyProfile existing = optional.get();
                existing.setCompanyName(companyProfile.getCompanyName());
                existing.setEmail(companyProfile.getEmail());
                existing.setPhone(companyProfile.getPhone());
                existing.setAddress(companyProfile.getAddress());
                existing.setWebsite(companyProfile.getWebsite());
                existing.setDescription(companyProfile.getDescription());
                existing.setLogo(companyProfile.getLogo());
                companyProfile = existing;
            }
        }
        companyProfileRepository.save(companyProfile);
    }

    @Transactional
    public CompanyProfileDto getProfile(Long userId) {
        Optional<CompanyProfile> optional = companyProfileRepository.findByUserId(userId);
        if (optional.isPresent()) {
            CompanyProfile companyProfile = optional.get();
            CompanyProfileDto companyProfileDto = new CompanyProfileDto(companyProfile);
            return companyProfileDto;
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    @Transactional
    public CompanyProfileDto getCompanyById(Long id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Company ID cannot be null");
            }
            Optional<CompanyProfile> optional = companyProfileRepository.findByUserId(id);
            if (optional.isPresent()) {
                CompanyProfileDto companyProfileDto = new CompanyProfileDto(optional.get());
                return companyProfileDto;
            }
            throw new IllegalArgumentException("Company not found");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public List<CompanyProfileDto> getAllProfiles(User user) {
        if (!user.getRole().equals(com.example.demo.model.User.Role.ADMIN)) {
            throw new RuntimeException("Only admin can view all profiles");
        }
        List<CompanyProfile> companyProfiles = companyProfileRepository.findAll();
        return companyProfiles.stream().map(CompanyProfileDto::new).toList();
    }

    @Transactional
    public void addComment(Long companyId, String comment) {
        CompanyProfile companyProfile = companyProfileRepository.findByUserId(companyId).orElse(null);
        if (companyProfile != null) {
            companyProfile.getComments().add(comment);
            companyProfileRepository.save(companyProfile);
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    @Transactional
    public void deleteComment(Authentication authentication, Long companyId, String comment) {
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        if (!user.getRole().equals(com.example.demo.model.User.Role.ADMIN)) {
            throw new RuntimeException("Only admin can delete comments");
        }
        CompanyProfile companyProfile = companyProfileRepository.findByUserId(companyId).orElse(null);
        if (companyProfile != null) {
            companyProfile.getComments().remove(comment);
            companyProfileRepository.save(companyProfile);
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    @Transactional
    public List<String> getComments(Long companyId) {
        CompanyProfile companyProfile = companyProfileRepository.findByUserId(companyId).orElse(null);
        if (companyProfile != null) {
            return companyProfile.getComments();
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }
}
