package com.upgrad.bookmyconsultation.controller;

import com.upgrad.bookmyconsultation.entity.Address;
import com.upgrad.bookmyconsultation.entity.Doctor;
import com.upgrad.bookmyconsultation.enums.Speciality;
import com.upgrad.bookmyconsultation.exception.InvalidInputException;
import com.upgrad.bookmyconsultation.model.TimeSlot;
import com.upgrad.bookmyconsultation.service.DoctorService;
import com.upgrad.bookmyconsultation.util.ValidationUtils;
import com.upgrad.bookmyconsultation.provider.token.JwtTokenProvider;
import com.upgrad.bookmyconsultation.repository.AddressRepository;
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
    @Autowired
    private AddressRepository addressRepository;

    // POST method to register a doctor
    @PostMapping
    public ResponseEntity<?> registerDoctor(@RequestHeader("authorization") String accessToken, @RequestBody java.util.Map<String, Object> doctorMap) {
        String token = accessToken.replace("Bearer ", "");
        String role = (String) JwtTokenProvider.decodeToken(token).get("role");

        if (!"admin".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only admins can add doctors.");
        }

        try {
            Doctor doctor = new Doctor();
            doctor.setFirstName((String) doctorMap.get("firstName"));
            doctor.setLastName((String) doctorMap.get("lastName"));
            doctor.setSpeciality(doctorMap.get("speciality") != null ? com.upgrad.bookmyconsultation.enums.Speciality.valueOf((String) doctorMap.get("speciality")) : null);
            doctor.setDob((String) doctorMap.get("dob"));
            doctor.setMobile((String) doctorMap.get("mobile"));
            doctor.setEmailId((String) doctorMap.get("emailId"));
            doctor.setPan((String) doctorMap.get("pan"));
           // doctor.setPassword((String) doctorMap.get("password"));
            doctor.setHighestQualification((String) doctorMap.get("highestQualification"));
            doctor.setCollege((String) doctorMap.get("college"));
            // Defensive: handle both int and string for totalYearsOfExp
            Object expObj = doctorMap.get("totalYearsOfExp");
            if (expObj != null) {
                if (expObj instanceof Integer) {
                    doctor.setTotalYearsOfExp((Integer) expObj);
                } else if (expObj instanceof String && !((String) expObj).isEmpty()) {
                    doctor.setTotalYearsOfExp(Integer.valueOf((String) expObj));
                }
            }
            Object ratingObj = doctorMap.get("rating");
            if (ratingObj != null) {
                if (ratingObj instanceof Number) {
                    doctor.setRating(((Number) ratingObj).doubleValue());
                } else if (ratingObj instanceof String && !((String) ratingObj).isEmpty()) {
                    doctor.setRating(Double.valueOf((String) ratingObj));
                }
            }
            // Extract address fields from nested address object
            java.util.Map<String, Object> addressMap = (java.util.Map<String, Object>) doctorMap.get("address");
            if (addressMap != null) {
                doctor.setAddressLine1((String) addressMap.get("addressLine1"));
                doctor.setAddressLine2((String) addressMap.get("addressLine2"));
                doctor.setCity((String) addressMap.get("city"));
                doctor.setState((String) addressMap.get("state"));
                doctor.setPostcode((String) addressMap.get("postCode"));
            }
            ValidationUtils.validate(doctor);
            Doctor savedDoctor = doctorService.register(doctor);
            Address address = new Address();
            address.setId(savedDoctor.getId());
            address.setAddressLine1(doctor.getAddressLine1());
            address.setAddressLine2(doctor.getAddressLine2());
            address.setCity(doctor.getCity());
            address.setPostcode(doctor.getPostcode());
            address.setState(doctor.getState());
            addressRepository.save(address);
            return ResponseEntity.ok(savedDoctor);
        } catch (InvalidInputException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing doctor registration: " + e.getMessage());
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