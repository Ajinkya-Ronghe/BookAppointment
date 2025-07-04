package com.upgrad.bookmyconsultation.service;

import com.upgrad.bookmyconsultation.entity.Appointment;
import com.upgrad.bookmyconsultation.entity.Doctor;
import com.upgrad.bookmyconsultation.entity.Rating;
import com.upgrad.bookmyconsultation.repository.DoctorRepository;
import com.upgrad.bookmyconsultation.repository.RatingsRepository;
import com.upgrad.bookmyconsultation.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RatingsService {

    @Autowired
    private RatingsRepository ratingsRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Method to submit ratings
    public void submitRatings(Rating rating) {
        // Set a UUID for the rating
        rating.setId(UUID.randomUUID().toString());

        // Save the rating to the database
        ratingsRepository.save(rating);

        // Update the doctor's average rating
        String doctorId = rating.getDoctorId();
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found for ID: " + doctorId));

        List<Rating> doctorRatings = ratingsRepository.findByDoctorId(doctorId);
        double averageRating = doctorRatings.stream().mapToInt(Rating::getRating).average().orElse(0.0);
        doctor.setRating(averageRating);

        // Save the updated doctor
        doctorRepository.save(doctor);

        // Update the appointment status to CLOSED
        Appointment appointment = appointmentRepository.findById(Long.parseLong(rating.getAppointmentId()))
                .orElseThrow(() -> new RuntimeException("Appointment not found for ID: " + rating.getAppointmentId()));
        appointment.setStatus("CLOSED");
        appointmentRepository.save(appointment);
    }
}

