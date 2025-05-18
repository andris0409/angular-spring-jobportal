package com.example.demo.dto;

import com.example.demo.model.Job;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JobDto {

    public JobDto(Job job) {
        this.id = job.getId();
        this.title = job.getTitle();
        this.location = job.getLocation();
        this.type = job.getType();
        this.description = job.getDescription();
        this.category = job.getCategory();
        this.companyId = job.getCompany().getId().toString();
        this.companyName = job.getCompany().getUsername();
        this.saved = job.isSaved();
    }

    Long id;
    String title;
    String location;
    String type;
    String description;
    String category;
    String companyId;
    String companyName;
    boolean saved;

}
