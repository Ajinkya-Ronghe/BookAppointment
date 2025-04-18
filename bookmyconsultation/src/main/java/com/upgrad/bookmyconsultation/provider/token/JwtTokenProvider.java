/*
 * Copyright 2018-2019, https://beingtechie.io.
 *
 * File: JwtTokenProvider.java
 * Date: May 5, 2018
 * Author: Thribhuvan Krishnamurthy
 */
package com.upgrad.bookmyconsultation.provider.token;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.upgrad.bookmyconsultation.exception.GenericErrorCode;
import com.upgrad.bookmyconsultation.exception.UnexpectedException;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoField;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Provider to serialize/deserialize the JWT specification based tokens.
 */
public class JwtTokenProvider {

	private static final String TOKEN_ISSUER = "https://bookmyconsultation.com";

	private final Algorithm algorithm;

	public JwtTokenProvider(final String secret) {
		try {
			algorithm = Algorithm.HMAC512(secret);
		} catch (IllegalArgumentException e) {
			throw new UnexpectedException(GenericErrorCode.GEN_001);
		}
	}

	public String generateToken(final String userUuid, final ZonedDateTime issuedDateTime, final ZonedDateTime expiresDateTime, final String role) {

		final Date issuedAt = new Date(issuedDateTime.getLong(ChronoField.INSTANT_SECONDS));
		final Date expiresAt = new Date(expiresDateTime.getLong(ChronoField.INSTANT_SECONDS));

		return JWT.create()
				.withIssuer(TOKEN_ISSUER)
				.withKeyId(UUID.randomUUID().toString())
				.withAudience(userUuid)
				.withClaim("role", role) // Add role to the token
				.withIssuedAt(issuedAt)
				.withExpiresAt(expiresAt)
				.sign(algorithm);
	}

	public static Map<String, Object> decodeToken(final String token) {
		try {
			DecodedJWT decodedJWT = JWT.decode(token);
			Map<String, Object> claims = new HashMap<>();
			decodedJWT.getClaims().forEach((key, value) -> claims.put(key, value.as(Object.class)));
			return claims;
		} catch (JWTDecodeException e) {
			throw new RuntimeException("Invalid token: " + e.getMessage(), e);
		}
	}

}