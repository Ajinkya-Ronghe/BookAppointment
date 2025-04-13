/*
 * Copyright 2018-2019, https://beingtechie.io.
 *
 * File: ErrorCode.java
 * Date: May 5, 2018
 * Author: Thribhuvan Krishnamurthy
 */
package com.upgrad.bookmyconsultation.exception;

/**
 * TODO: Provide javadoc
 */
/**
 * Interface defining methods to retrieve error codes and error descriptions used across exceptions in the application.
 */
public interface ErrorCode {

    String getCode();

    String getDefaultMessage();

}