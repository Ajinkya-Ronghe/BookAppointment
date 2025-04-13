package com.upgrad.bookmyconsultation.controller;

import com.upgrad.bookmyconsultation.entity.Appointment;
import com.upgrad.bookmyconsultation.exception.InvalidInputException;
import com.upgrad.bookmyconsultation.exception.ResourceUnAvailableException;
import com.upgrad.bookmyconsultation.exception.SlotUnavailableException;
import com.upgrad.bookmyconsultation.service.AppointmentService;
import com.upgrad.bookmyconsultation.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // POST method to book an appointment
    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        try {
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

/*     // GET method to retrieve an appointment by ID
    @GetMapping("/{appointmentId}")
    public ResponseEntity<?> getAppointment(@PathVariable String appointmentId) {
        try {
            // Retrieve the appointment details
            Appointment appointment = appointmentService.getAppointment(appointmentId);

            // Return the appointment details
            return ResponseEntity.ok(appointment);
        } catch (ResourceUnAvailableException e) {
            return ResponseEntity.notFound().build();
        }
    }
 */

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
}

