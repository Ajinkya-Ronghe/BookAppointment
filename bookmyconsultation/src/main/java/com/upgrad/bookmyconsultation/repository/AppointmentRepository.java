package com.upgrad.bookmyconsultation.repository;

import com.upgrad.bookmyconsultation.entity.Appointment;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends CrudRepository<Appointment, Long> {

    // Find appointments by user ID (mapped to user_id in the database)
    List<Appointment> findByUserId(String userId);

    // Find appointments by doctor ID, time slot, and appointment date
    Appointment findByDoctorIdAndTimeSlotAndAppointmentDate(String doctorId, String timeSlot, String appointmentDate);
}
