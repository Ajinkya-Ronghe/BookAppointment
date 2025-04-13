package com.upgrad.bookmyconsultation.exception;

public class UnauthorizedException extends RestException {

    public UnauthorizedException(final ErrorCode errorCode, final Object... parameters) {
        super(errorCode, parameters);
    }

    public UnauthorizedException(final ErrorCode errorCode, final String message) {
        super(errorCode, message);
    }

}
