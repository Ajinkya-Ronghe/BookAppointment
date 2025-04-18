package com.upgrad.bookmyconsultation.util;

import com.upgrad.bookmyconsultation.entity.Appointment;
import com.upgrad.bookmyconsultation.entity.Doctor;
import com.upgrad.bookmyconsultation.entity.User;
import com.upgrad.bookmyconsultation.exception.InvalidInputException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Component
public class ValidationUtils {

    public static void validate(User user) throws InvalidInputException {
        List<String> errorFields = new ArrayList<>();
        if (StringUtils.isEmpty(user.getFirstName())) {
            errorFields.add("First Name");
        }
        if (StringUtils.isEmpty(user.getLastName())) {
            errorFields.add("Last Name");
        }
        if (StringUtils.isEmpty(user.getEmailId())) {
            errorFields.add("Email ID");
        }
        if (StringUtils.isEmpty(user.getPassword())) {
            errorFields.add("Password");
        }
        if (!errorFields.isEmpty()) {
            throw new InvalidInputException(errorFields);
        }
    }

    public static void validate(Doctor doctor) throws InvalidInputException {
        List<String> errorFields = new ArrayList<>();
        if (StringUtils.isEmpty(doctor.getFirstName())) {
            errorFields.add("First Name");
        }
        if (StringUtils.isEmpty(doctor.getLastName())) {
            errorFields.add("Last Name");
        }
        if (doctor.getDob() == null || !isValid(doctor.getDob())) {
            errorFields.add("Date of Birth (format: YYYY-MM-DD)");
        }
        if (!errorFields.isEmpty()) {
            throw new InvalidInputException(errorFields);
        }
    }

    public static void validate(Appointment appointment) throws InvalidInputException {
        List<String> errorFields = new ArrayList<>();
        if (StringUtils.isEmpty(appointment.getDoctorId())) {
            errorFields.add("Doctor ID");
        }
        if (StringUtils.isEmpty(appointment.getUserId())) {
            errorFields.add("User ID");
        }
        if (StringUtils.isEmpty(appointment.getTimeSlot())) {
            errorFields.add("Time slot");
        }
        if (appointment.getAppointmentDate() == null || !isValid(appointment.getAppointmentDate())) {
            errorFields.add("Appointment Date");
        }
        if (!errorFields.isEmpty()) {
            throw new InvalidInputException(errorFields);
        }
    }

    public static boolean isValid(String dateStr) {
        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setLenient(false);
        try {
            sdf.parse(dateStr);
        } catch (ParseException e) {
            return false;
        }
        return true;
    }
}
