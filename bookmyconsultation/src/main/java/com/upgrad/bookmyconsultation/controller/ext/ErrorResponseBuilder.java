package com.upgrad.bookmyconsultation.controller.ext;

public class ErrorResponseBuilder {

    public static ErrorResponse build(String code, String message) {
        return new ErrorResponse(code, message);
    }
}
