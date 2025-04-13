package com.upgrad.bookmyconsultation.service;

import com.upgrad.bookmyconsultation.entity.User;
import com.upgrad.bookmyconsultation.exception.InvalidInputException;
import com.upgrad.bookmyconsultation.exception.ResourceUnAvailableException;
import com.upgrad.bookmyconsultation.provider.PasswordCryptographyProvider;
import com.upgrad.bookmyconsultation.repository.UserRepository;
import com.upgrad.bookmyconsultation.util.ValidationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordCryptographyProvider passwordCryptographyProvider;

    // Method to register a user
    public User register(User user) throws InvalidInputException {
        // Validate user details
        ValidationUtils.validate(user);

        // Encrypt the password
        String[] encryptedData = passwordCryptographyProvider.encrypt(user.getPassword());
        user.setSalt(encryptedData[0]);
        user.setPassword(encryptedData[1]);

        // Save the user to the database
        return userRepository.save(user);
    }

    // Method to get a user by email ID
    public User getUser(String emailId) throws ResourceUnAvailableException {
        return Optional.ofNullable(userRepository.findByEmailId(emailId))
                .orElseThrow(() -> new ResourceUnAvailableException("User not found for email ID: " + emailId));
    }
}
