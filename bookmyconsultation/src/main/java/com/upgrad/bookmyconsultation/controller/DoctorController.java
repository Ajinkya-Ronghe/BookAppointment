package com.upgrad.bookmyconsultation.controller;

import com.upgrad.bookmyconsultation.entity.Doctor;
import com.upgrad.bookmyconsultation.enums.Speciality;
import com.upgrad.bookmyconsultation.exception.InvalidInputException;
import com.upgrad.bookmyconsultation.model.TimeSlot;
import com.upgrad.bookmyconsultation.service.DoctorService;
import com.upgrad.bookmyconsultation.util.ValidationUtils;
import com.upgrad.bookmyconsultation.provider.token.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.InvalidParameterException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // POST method to register a doctor
    @PostMapping
    public ResponseEntity<?> registerDoctor(@RequestHeader("authorization") String accessToken, @RequestBody Doctor doctor) {
        String token = accessToken.replace("Bearer ", "");
        String role = (String) JwtTokenProvider.decodeToken(token).get("role");

        if (!"admin".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only admins can add doctors.");
        }

        try {
            ValidationUtils.validate(doctor);
            Doctor savedDoctor = doctorService.register(doctor);
            return ResponseEntity.ok(savedDoctor);
        } catch (InvalidInputException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET method to retrieve a doctor by ID
    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable String id) {
        Doctor doctor = doctorService.getDoctor(id);
        return ResponseEntity.ok(doctor);
    }

    // GET method to retrieve all doctors with optional filters
    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors(@RequestParam(value = "speciality", required = false) String speciality) {
        return ResponseEntity.ok(doctorService.getAllDoctorsWithFilters(speciality));
    }

    // GET method to retrieve all available specialities
    @GetMapping("/speciality")
    public ResponseEntity<List<String>> getSpeciality() {
        return ResponseEntity.ok(Stream.of(Speciality.values())
                .map(Enum::name)
                .collect(Collectors.toList()));
    }

    // GET method to retrieve available time slots for a doctor
    @GetMapping("/{doctorId}/timeSlots")
    public ResponseEntity<TimeSlot> getTimeSlots(@RequestParam(value = "date", required = false) String date,
                                                 @PathVariable String doctorId) {
        if (!ValidationUtils.isValid(date)) {
            throw new InvalidParameterException("Not a valid date");
        }

        Doctor doctor = doctorService.getDoctor(doctorId);
        if (doctor == null) {
            throw new InvalidParameterException("Not a valid doctor ID");
        }

        return ResponseEntity.ok(doctorService.getTimeSlots(doctorId, date));
    }
}