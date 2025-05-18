package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.PersonProfile;
import com.example.demo.model.User;

@Repository
public interface PersonProfileRepository extends JpaRepository<PersonProfile, Long> {

    Optional<PersonProfile> findByUserId(Long userId);

    List<PersonProfile> findAllBySavedJobs_Id(Long jobId);

    boolean existsByUserId(Long userId);

    void deleteByUserId(Long id);
}
