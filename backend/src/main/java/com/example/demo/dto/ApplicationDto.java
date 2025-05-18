package com.example.demo.dto;

import com.example.demo.model.Application;
import com.example.demo.model.Job;
import com.example.demo.model.PersonProfile;
import com.example.demo.model.User;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApplicationDto {

    public ApplicationDto(Application application) {
        this.id = application.getId();
        this.userdto = new UserDto(application.getUser());
        this.jobdto = new JobDto(application.getJob());
    }

    private Long id;
    private UserDto userdto;
    private JobDto jobdto;

}
