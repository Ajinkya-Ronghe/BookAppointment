package com.upgrad.bookmyconsultation.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "rating", schema = "public") // Specify schema and table name
@Data
@NoArgsConstructor
public class Rating {

    @Id
    @Column(name = "id")
    private String id = UUID.randomUUID().toString();

    @Column(name = "appointment_id")
    private String appointmentId;

    @Column(name = "doctor_id")
    private String doctorId;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "comments")
    private String comments;
}

