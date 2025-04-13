package com.upgrad.bookmyconsultation.servlet;

import com.upgrad.bookmyconsultation.entity.UserAuthToken;
import com.upgrad.bookmyconsultation.exception.AuthorizationFailedException;
import com.upgrad.bookmyconsultation.exception.RestErrorCode;
import com.upgrad.bookmyconsultation.exception.UnauthorizedException;
import com.upgrad.bookmyconsultation.provider.BearerAuthDecoder;
import com.upgrad.bookmyconsultation.service.AuthTokenService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.upgrad.bookmyconsultation.constants.ResourceConstants.BASIC_AUTH_PREFIX;

@Component
public class AuthFilter extends ApiFilter {

    @Override
    public void doFilter(HttpServletRequest servletRequest, HttpServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        if (servletRequest.getMethod().equalsIgnoreCase("OPTIONS")) {
            servletResponse.setStatus(HttpServletResponse.SC_ACCEPTED);
            return;
        }

        final String pathInfo = servletRequest.getRequestURI();

        // Exclude login and register endpoints from authentication
        if (pathInfo.contains("/auth/login") || pathInfo.contains("/users")) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        final String authorization = servletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.isEmpty(authorization)) {
            throw new UnauthorizedException(RestErrorCode.ATH_001, "Authorization header is missing");
        }

        if (pathInfo.contains("login") && !authorization.startsWith(BASIC_AUTH_PREFIX)) {
            throw new UnauthorizedException(RestErrorCode.ATH_002, "Only BASIC authentication is supported");
        }

        if (!pathInfo.contains("login")) {
            final String accessToken = new BearerAuthDecoder(authorization).getAccessToken();
            try {
                // Validate the access token
            } catch (Exception e) {
                throw new UnauthorizedException(RestErrorCode.ATH_004, "Bearer auth token is missing or invalid");
            }
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}
