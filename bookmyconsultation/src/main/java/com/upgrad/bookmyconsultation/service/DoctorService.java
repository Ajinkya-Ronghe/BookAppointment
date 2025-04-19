package com.upgrad.bookmyconsultation.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.upgrad.bookmyconsultation.entity.Doctor;
import com.upgrad.bookmyconsultation.enums.Speciality;
import com.upgrad.bookmyconsultation.exception.InvalidInputException;
import com.upgrad.bookmyconsultation.exception.ResourceUnAvailableException;
import com.upgrad.bookmyconsultation.model.TimeSlot;
import com.upgrad.bookmyconsultation.repository.AddressRepository;
import com.upgrad.bookmyconsultation.repository.AppointmentRepository;
import com.upgrad.bookmyconsultation.repository.DoctorRepository;
import com.upgrad.bookmyconsultation.util.ValidationUtils;

import lombok.extern.log4j.Log4j2;
import springfox.documentation.annotations.Cacheable;

@Log4j2
@Service
public class DoctorService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AddressRepository addressRepository;

    // Method to register a doctor
    public Doctor register(Doctor doctor) throws InvalidInputException {
        ValidationUtils.validate(doctor);

        /*if (doctor.getAddress() == null || doctor.getAddress().isEmpty()) {
            throw new InvalidInputException("Address cannot be null or empty");
        }*/

        doctor.setId(UUID.randomUUID().toString());
        return doctorRepository.save(doctor);
    }

    // Method to get a doctor by ID
    public Doctor getDoctor(String id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceUnAvailableException("Doctor not found for ID: " + id));
    }

    // Method to get all doctors with filters
    public List<Doctor> getAllDoctorsWithFilters(String speciality) {
        if (speciality != null && !speciality.isEmpty()) {
            return doctorRepository.findBySpecialityOrderByRatingDesc(Speciality.valueOf(speciality));
        }
        return getActiveDoctorsSortedByRating();
    }

    @Cacheable(value = "doctorListByRating")
    private List<Doctor> getActiveDoctorsSortedByRating() {
        log.info("Fetching doctor list from the database");

        // Fetch all doctors sorted by rating
        List<Doctor> doctors = doctorRepository.findAllByOrderByRatingDesc()
                .stream()
                .limit(20)
                .collect(Collectors.toList());

        // Fetch and map addresses for each doctor
        doctors.forEach(doctor -> {
            addressRepository.findById(doctor.getId()).ifPresent(address -> {
                doctor.setAddressLine1(address.getAddressLine1());
                doctor.setAddressLine2(address.getAddressLine2());
                doctor.setCity(address.getCity());
                doctor.setPostcode(address.getPostcode());
                doctor.setState(address.getState());
            });
        });

        return doctors;
    }

    // Method to get available time slots for a doctor
    public TimeSlot getTimeSlots(String doctorId, String date) {
        TimeSlot timeSlot = new TimeSlot(doctorId, date);
        timeSlot.setTimeSlot(timeSlot.getTimeSlot()
                .stream()
                .filter(slot -> appointmentRepository
                        .findByDoctorIdAndTimeSlotAndAppointmentDate(timeSlot.getDoctorId(), slot, timeSlot.getAvailableDate()) == null)
                .collect(Collectors.toList()));

        return timeSlot;
    }
}

