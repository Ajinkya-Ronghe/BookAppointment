package com.upgrad.bookmyconsultation.entity;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.upgrad.bookmyconsultation.enums.Speciality;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "doctor", schema = "public") // Specify schema and table name
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Doctor {
    @Id
    @Column(name = "id")
    private String id = UUID.randomUUID().toString();

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "speciality")
    private Speciality speciality;

    @Column(name = "dob")
    private String dob;

    @JoinColumn(name = "address")
    private String address;

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(name = "city")
    private String city;

    @Column(name = "postcode")
    private String postcode;

    @Column(name = "state")
    private String state;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "email_id")
    private String emailId;

    @Column(name = "pan")
    private String pan;

    @Column(name = "highest_qualification")
    private String highestQualification;

    @Column(name = "college")
    private String college;

    @Column(name = "total_years_of_exp")
    private Integer totalYearsOfExp;

    @Column(name = "rating")
    private Double rating;
}
