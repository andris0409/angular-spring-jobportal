package com.example.demo.dto;

import com.example.demo.model.User.Role;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDto {

    public UserDto(com.example.demo.model.User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
    }

    private Long id;
    private String username;
    private String email;
    private Role role;
}
