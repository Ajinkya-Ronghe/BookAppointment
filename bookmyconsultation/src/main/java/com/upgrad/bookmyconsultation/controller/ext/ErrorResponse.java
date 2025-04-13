package com.upgrad.bookmyconsultation.controller.ext;

public class ErrorResponse {
    private String code;
    private String message;
    private String rootCause;

    public ErrorResponse() {}

    public ErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public ErrorResponse code(String code) {
        this.code = code;
        return this; // Enable method chaining
    }

    public String getMessage() {
        return message;
    }

    public ErrorResponse message(String message) {
        this.message = message;
        return this; // Enable method chaining
    }

    public String getRootCause() {
        return rootCause;
    }

    public ErrorResponse rootCause(String rootCause) {
        this.rootCause = rootCause;
        return this; // Enable method chaining
    }
}
