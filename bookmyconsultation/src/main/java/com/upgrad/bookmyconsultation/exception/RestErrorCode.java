package com.upgrad.bookmyconsultation.exception;

public enum RestErrorCode implements ErrorCode {

    ATH_001("ATH-001", "Authorization header is missing"),
    ATH_002("ATH-002", "Only BASIC authentication is supported"),
    ATH_003("ATH-003", "Only BEARER auth token is supported"),
    ATH_004("ATH-004", "Bearer auth token is missing or invalid");

    private final String code;
    private final String defaultMessage;

    RestErrorCode(final String code, final String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getDefaultMessage() {
        return defaultMessage;
    }
}