package com.upgrad.bookmyconsultation.controller.ext;

import org.springframework.http.ResponseEntity;

public class ResponseBuilder {

    public static ResponseEntity<Object> build(Object body) {
        return ResponseEntity.ok(body);
    }
}
