package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Application;
import com.example.demo.model.Job;
import com.example.demo.model.User;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUser(User user);

    List<User> findByJob(Job job);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END " +
            "FROM Application a " +
            "WHERE a.user = :user AND a.job = :job")
    boolean existsByUserAndJob(@Param("user") User user, @Param("job") Job job);

}
