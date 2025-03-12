package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.PersonProfile;
import com.example.demo.repository.PersonProfileRepository;

@Service
public class PersonProfileService {

    @Autowired
    private PersonProfileRepository personProfileRepository;

    public void saveProfile(PersonProfile personProfile) {
        personProfileRepository.save(personProfile);
    }

    public PersonProfile getProfile(Long userId) {
        return personProfileRepository.findByUserId(userId).orElse(null);
    }
}
