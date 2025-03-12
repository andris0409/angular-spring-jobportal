package com.example.demo.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "jobs")
@Getter
@Setter
public class Job {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    private String location;

    private String type;

    private String description;

    private String category;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private User company;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Application> applications = new ArrayList<>();

}
