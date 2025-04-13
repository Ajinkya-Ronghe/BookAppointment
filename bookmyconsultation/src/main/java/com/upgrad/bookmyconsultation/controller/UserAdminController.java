package com.upgrad.bookmyconsultation.controller;

import com.upgrad.bookmyconsultation.entity.User;
import com.upgrad.bookmyconsultation.exception.InvalidInputException;
import com.upgrad.bookmyconsultation.exception.ResourceUnAvailableException;
import com.upgrad.bookmyconsultation.service.AppointmentService;
import com.upgrad.bookmyconsultation.service.UserService;
import com.upgrad.bookmyconsultation.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserAdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AppointmentService appointmentService;

    // POST method to create a user
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Validate the user details
            ValidationUtils.validate(user);

            // Register the user
            User savedUser = userService.register(user);

            // Return HTTP response with status OK
            return ResponseEntity.ok(savedUser);
        } catch (InvalidInputException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET method to retrieve a user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@RequestHeader("authorization") String accessToken,
                                        @PathVariable("id") final String userUuid) {
        try {
            User user = userService.getUser(userUuid);
            return ResponseEntity.ok(user);
        } catch (ResourceUnAvailableException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET method to retrieve appointments for a user
    @GetMapping("/{userId}/appointments")
    public ResponseEntity<?> getAppointmentForUser(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForUser(userId));
    }
}
