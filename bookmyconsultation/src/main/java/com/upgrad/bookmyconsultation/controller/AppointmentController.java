package com.upgrad.bookmyconsultation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upgrad.bookmyconsultation.entity.Appointment;
import com.upgrad.bookmyconsultation.exception.InvalidInputException;
import com.upgrad.bookmyconsultation.exception.SlotUnavailableException;
import com.upgrad.bookmyconsultation.service.AppointmentService;
import com.upgrad.bookmyconsultation.util.ValidationUtils;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // POST method to book an appointment
    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        try {
            // Set createdDate to today if not provided
            if (appointment.getCreatedDate() == null || appointment.getCreatedDate().isEmpty()) {
                appointment.setCreatedDate(java.time.LocalDate.now().toString());
            }
            // Validate the appointment details
            ValidationUtils.validate(appointment);

            // Book the appointment
            Long id = appointmentService.appointment(appointment);

            // Return HTTP response with the appointment ID
            return ResponseEntity.ok(id);
        } catch (InvalidInputException | SlotUnavailableException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET method to retrieve all appointments by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAppointmentsByUserId(@PathVariable String userId) {
        try {
            // Retrieve the list of appointments for the given user ID
            List<Appointment> appointments = appointmentService.getAppointmentsByUserId(userId);

            // Return the list of appointments
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            // Handle any unexpected exceptions
            return ResponseEntity.status(500).body("An error occurred while fetching appointments.");
        }
    }

    // GET method to retrieve an appointment by appointment ID
    @GetMapping("/{appointmentId}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long appointmentId) {
        Appointment appointment = appointmentService.getAppointmentById(appointmentId);
        if (appointment != null) {
            return ResponseEntity.ok(appointment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

