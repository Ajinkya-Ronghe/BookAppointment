package com.upgrad.bookmyconsultation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "appointment", schema = "public") // Specify schema and table name
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use database auto-increment
    @Column(name = "appointment_id")
    private Long appointmentId; // Change type to Long to match the database

    @Column(name = "appointment_date")
    private String appointmentDate;

    @Column(name = "doctor_id")
    private String doctorId;

    @Column(name = "user_id") // Correctly map to the user_id column in the database
    private String userId;

    @Column(name = "time_slot")
    private String timeSlot;

    @Column(name = "status")
    private String status;

    @Column(name = "doctor_name")
    private String doctorName;

    @Column(name = "prior_medical_history")
    private String priorMedicalHistory;

    @Column(name = "symptoms")
    private String symptoms;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "created_date")
    private String createdDate;
}
