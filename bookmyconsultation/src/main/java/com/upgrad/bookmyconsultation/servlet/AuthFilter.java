package com.upgrad.bookmyconsultation.servlet;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

import com.upgrad.bookmyconsultation.provider.BearerAuthDecoder;
import com.upgrad.bookmyconsultation.service.AuthTokenService;

@Component
public class AuthFilter extends ApiFilter {

    private final AuthTokenService authTokenService;

    public AuthFilter(AuthTokenService authTokenService) {
        this.authTokenService = authTokenService;
    }

    @Override
    public void doFilter(HttpServletRequest servletRequest, HttpServletResponse servletResponse,
            FilterChain filterChain) throws IOException, ServletException {

        if (servletRequest.getMethod().equalsIgnoreCase("OPTIONS")) {
            servletResponse.setStatus(HttpServletResponse.SC_ACCEPTED);
            return;
        }

        final String path = servletRequest.getRequestURI();
        final String method = servletRequest.getMethod();

        // Allow only POST /auth/login, POST /users, POST /users/register, GET /doctors,
        // GET /doctors/speciality without token
        boolean isLogin = path.equals("/auth/login") && method.equalsIgnoreCase("POST");
        boolean isRegister = (path.equals("/users") && method.equalsIgnoreCase("POST")) ||
                (path.equals("/users/register") && method.equalsIgnoreCase("POST"));
        boolean isDoctorsList = path.equals("/doctors") && method.equalsIgnoreCase("GET");
        boolean isDoctorsSpeciality = path.equals("/doctors/speciality") && method.equalsIgnoreCase("GET");

        if (isLogin || isRegister || isDoctorsList || isDoctorsSpeciality) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // All other endpoints require Bearer token
        final String authorization = servletRequest.getHeader("authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            servletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            servletResponse.getWriter().write("Authorization header is missing or invalid");
            return;
        }

        // Token validation logic
        try {
            final String accessToken = new BearerAuthDecoder(authorization).getAccessToken();
            authTokenService.validateToken(accessToken);
        } catch (Exception e) {
            servletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            servletResponse.getWriter().write("Bearer auth token is missing or invalid");
            return;
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}
