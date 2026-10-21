package com.frajaytech.eCountyService.Service;

import com.frajaytech.eCountyService.Dto.TechnicianActivationDtos.ActivateTechnicianRequest;
import com.frajaytech.eCountyService.Dto.TechnicianActivationDtos.ActivationMessage;
import com.frajaytech.eCountyService.Entity.TechnicianActivationToken;
import com.frajaytech.eCountyService.Entity.User;
import com.frajaytech.eCountyService.Repository.TechnicianActivationTokenRepository;
import com.frajaytech.eCountyService.Repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Service
public class TechnicianActivationService {

    private static final Logger logger =
            LoggerFactory.getLogger(TechnicianActivationService.class);

    private final TechnicianActivationTokenRepository tokens;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final HttpEmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.technician-activation.expiry-hours:24}")
    private long expiryHours;

    public TechnicianActivationService(
            TechnicianActivationTokenRepository tokens,
            UserRepository users,
            PasswordEncoder passwordEncoder,
            HttpEmailService emailService) {

        this.tokens = tokens;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    /**
     * Creates an activation token for an existing inactive technician
     * and attempts to send the activation email.
     *
     * A mail delivery failure is logged instead of propagated, allowing
     * the database transaction to complete when the database operations
     * themselves succeed.
     */
    @Transactional
    public void issueAndSend(User technician) {

        validateTechnicianForActivation(technician);

        if (expiryHours <= 0) {
            throw new IllegalStateException(
                    "Activation expiry must be greater than zero hours");
        }

        if (!emailService.isConfigured()) {
            logger.error(
                    "Cannot send technician activation email: "
                            + "resend.api-key is not configured. "
                            + "Technician ID: {}",
                    technician.getId());
            return;
        }

        // Invalidate previous unused activation tokens.
        tokens.deleteUnusedTokensForUser(technician.getId());

        // Generate a cryptographically secure URL-safe token.
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        TechnicianActivationToken activationToken =
                new TechnicianActivationToken();

        activationToken.setUser(technician);
        activationToken.setTokenHash(hashToken(rawToken));
        activationToken.setExpiresAt(
                Instant.now().plus(expiryHours, ChronoUnit.HOURS));
        activationToken.setUsedAt(null);

        // Store only the token hash, never the raw token.
        tokens.save(activationToken);

        String cleanFrontendUrl =
                frontendUrl.replaceAll("/+$", "");

        String activationLink = cleanFrontendUrl
                + "/activate-technician?token="
                + rawToken;

        String body =
                "Hello " + technician.getFullName() + ",\n\n"
                        + "An administrator has registered you as a "
                        + "technician on eCounty Services.\n\n"
                        + "To activate your account and set your password, "
                        + "open the link below:\n\n"
                        + activationLink + "\n\n"
                        + "This link expires in " + expiryHours
                        + " hours and can only be used once.\n\n"
                        + "If you were not expecting this invitation, "
                        + "contact your eCounty Services administrator.\n\n"
                        + "eCounty Services";

        try {
            emailService.sendText(
                    technician.getEmail(),
                    "Activate your eCounty Services technician account",
                    body);

            logger.info(
                    "Activation email submitted successfully for "
                            + "technician ID {}",
                    technician.getId());

        } catch (RestClientException exception) {

            // Do not log the activation URL or raw activation token.
            logger.error(
                    "Activation email delivery failed for technician ID {}. "
                            + "The administrator should retry sending it.",
                    technician.getId(),
                    exception);
        }
    }

    /**
     * Validates the activation token and sets the technician's password.
     */
    @Transactional
    public ActivationMessage activate(
            ActivateTechnicianRequest request) {

        if (request == null
                || !StringUtils.hasText(request.token())
                || !StringUtils.hasText(request.password())
                || !StringUtils.hasText(request.confirmPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Token, password and password confirmation are required");
        }

        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Passwords do not match");
        }

        if (request.password().length() < 12
                || request.password().length() > 72) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password must contain between 12 and 72 characters");
        }

        String suppliedTokenHash = hashToken(request.token());

        TechnicianActivationToken activationToken =
                tokens.findByTokenHash(suppliedTokenHash)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Invalid or expired activation link"));

        if (activationToken.getUsedAt() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This activation link has already been used");
        }

        if (activationToken.getExpiresAt() == null
                || !activationToken.getExpiresAt()
                .isAfter(Instant.now())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This activation link has expired. "
                            + "Contact your administrator for a new "
                            + "activation email");
        }

        if (activationToken.getUser() == null
                || activationToken.getUser().getId() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid activation link");
        }

        User technician = users.findById(
                        activationToken.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Technician account not found"));

        if (!"TECHNICIAN".equalsIgnoreCase(technician.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This activation link is not for a technician account");
        }

        if (technician.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This technician account is already active");
        }

        technician.setPasswordHash(
                passwordEncoder.encode(request.password()));

        technician.setActive(true);

        users.save(technician);

        activationToken.setUsedAt(Instant.now());
        tokens.save(activationToken);

        logger.info(
                "Technician account activated successfully. Technician ID: {}",
                technician.getId());

        return new ActivationMessage(
                "Your technician account has been activated. "
                        + "You can now log in.");
    }

    /**
     * Generates a fresh activation token for an inactive technician.
     */
    @Transactional
    public void resendActivation(Long technicianId) {

        if (technicianId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Technician ID is required");
        }

        User technician = users.findById(technicianId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Technician account not found"));

        validateTechnicianForActivation(technician);

        issueAndSend(technician);
    }

    /**
     * Validates that the account is eligible for activation.
     */
    private void validateTechnicianForActivation(User technician) {

        if (technician == null || technician.getId() == null) {
            throw new IllegalArgumentException(
                    "A saved technician account is required");
        }

        if (!"TECHNICIAN".equalsIgnoreCase(technician.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Activation is only available for technician accounts");
        }

        if (technician.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This technician account is already active");
        }

        if (!StringUtils.hasText(technician.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The technician does not have an email address");
        }
    }

    /**
     * Stores only a SHA-256 hash of the activation token.
     */
    private String hashToken(String token) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8));

            return java.util.HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is unavailable",
                    exception);
        }
    }
}