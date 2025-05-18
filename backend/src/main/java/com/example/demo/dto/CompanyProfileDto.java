package com.example.demo.dto;

import java.util.List;

import com.example.demo.model.CompanyProfile;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CompanyProfileDto {

    public CompanyProfileDto(CompanyProfile profile) {
        this.id = profile.getUser().getId();
        this.companyName = profile.getCompanyName();
        this.email = profile.getEmail();
        this.phone = profile.getPhone();
        this.address = profile.getAddress();
        this.website = profile.getWebsite();
        this.description = profile.getDescription();
        this.logo = profile.getLogo();
        this.comments = profile.getComments();
    }

    private Long id;
    private String companyName;

    private String email;

    private String phone;

    private String address;

    private String website;

    private String description;

    private byte[] logo;

    private List<String> comments;
}
