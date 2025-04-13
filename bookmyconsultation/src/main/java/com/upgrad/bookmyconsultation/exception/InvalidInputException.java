package com.upgrad.bookmyconsultation.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class InvalidInputException extends Exception {
    private List<String> attributeNames;

    // Add a constructor that accepts a String message
    public InvalidInputException(String message) {
        super(message);
    }
}
