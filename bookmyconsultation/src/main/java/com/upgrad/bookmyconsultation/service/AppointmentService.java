package com.upgrad.bookmyconsultation.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.upgrad.bookmyconsultation.entity.Appointment;
import com.upgrad.bookmyconsultation.exception.InvalidInputException;
import com.upgrad.bookmyconsultation.exception.SlotUnavailableException;
import com.upgrad.bookmyconsultation.repository.AppointmentRepository;
import com.upgrad.bookmyconsultation.util.ValidationUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Method to book an appointment
    public Long appointment(Appointment appointment) throws SlotUnavailableException, InvalidInputException {
        // Validate the appointment details
        ValidationUtils.validate(appointment);

        // Check if the slot is already booked
        if (appointmentRepository.findByDoctorIdAndTimeSlotAndAppointmentDate(
                appointment.getDoctorId(), appointment.getTimeSlot(), appointment.getAppointmentDate()) != null) {
            throw new SlotUnavailableException("The selected slot is unavailable.");
        }

        // Save the appointment to the database
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Return the generated appointment ID
        return savedAppointment.getAppointmentId();
    }

    // Method to get all appointments for a user
    public List<Appointment> getAppointmentsForUser(String userId) {
        return appointmentRepository.findByUserId(userId);
    }

    // Method to get all appointments for a specific user ID
    public List<Appointment> getAppointmentsByUserId(String userId) {
        return appointmentRepository.findByUserId(userId);
    }

    public Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId).orElse(null);
    }
}

