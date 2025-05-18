package com.example.demo.dto;

import com.example.demo.model.PersonProfile;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PersonProfileDto {

    public PersonProfileDto(PersonProfile profile) {
        this.id = profile.getId();
        this.fullName = profile.getFullName();
        this.email = profile.getEmail();
        this.phone = profile.getPhone();
        this.address = profile.getAddress();
        this.birthDate = profile.getBirthDate();
        this.cv = profile.getCv();
    }

    Long id;
    String fullName;
    String email;
    String phone;
    String address;
    String birthDate;
    byte[] cv;

}
