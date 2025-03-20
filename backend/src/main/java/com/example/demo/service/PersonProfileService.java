package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.PersonProfile;
import com.example.demo.model.User;
import com.example.demo.repository.PersonProfileRepository;

@Service
public class PersonProfileService {

    @Autowired
    private PersonProfileRepository personProfileRepository;

    public void saveProfile(User user, PersonProfile personProfile) {
        personProfileRepository.deleteAll(); // Clear the table for testing purposes
        personProfile.setUser(user);
        personProfileRepository.save(personProfile);
    }

    public PersonProfile getProfile(Long userId) {
        return personProfileRepository.findByUserId(userId).orElse(null);
    }

    @Transactional
    public byte[] getCvDataForUser(User user) {
        PersonProfile profile = personProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        byte[] cvData = profile.getCv();
        System.out.println("Fetched CV data length: " + cvData.length);
        return cvData;
    }
}
