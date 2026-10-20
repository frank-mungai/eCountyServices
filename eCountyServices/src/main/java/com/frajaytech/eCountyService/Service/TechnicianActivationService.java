 package com.frajaytech.eCountyService.Service;

import com.frajaytech.eCountyService.Dto.TechnicianActivationDtos.ActivateTechnicianRequest;
import com.frajaytech.eCountyService.Dto.TechnicianActivationDtos.ActivationMessage;
import com.frajaytech.eCountyService.Entity.TechnicianActivationToken;
import com.frajaytech.eCountyService.Entity.User;
import com.frajaytech.eCountyService.Repository.TechnicianActivationTokenRepository;
import com.frajaytech.eCountyService.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Locale;

import org.springframework.util.StringUtils;

@Service
public class TechnicianActivationService {

    private final TechnicianActivationTokenRepository tokens;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.technician-activation.expiry-hours:24}")
    private long expiryHours;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public TechnicianActivationService(
            TechnicianActivationTokenRepository tokens,
            UserRepository users,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender) {

        this.tokens = tokens;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    /**
     * Creates a new activation token and emails the activation link.
     * The technician must already exist and be inactive.
     */
    @Transactional
    public void issueAndSend(User technician) {

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

        if (expiryHours <= 0) {
            throw new IllegalStateException(
                    "Activation expiry must be greater than zero hours");
        }

        // Invalidate earlier unused activation tokens.
        tokens.deleteUnusedTokensForUser(technician.getId());

        // Generate a cryptographically secure, URL-safe token.
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

        tokens.save(activationToken);

        String cleanFrontendUrl = frontendUrl.replaceAll("/+$", "");
        String activationLink = cleanFrontendUrl
                + "/activate-technician?token="
                + rawToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(technician.getEmail());
        message.setSubject("Activate your eCounty Services technician account");

        message.setText(
                "Hello " + technician.getFullName() + ",\n\n"
                        + "An administrator has registered you as a technician "
                        + "on eCounty Services.\n\n"
                        + "To activate your account and set your password, open "
                        + "the link below:\n\n"
                        + activationLink + "\n\n"
                        + "This link expires in " + expiryHours + " hours and can "
                        + "only be used once.\n\n"
                        + "If you were not expecting this invitation, contact "
                        + "your eCounty Services administrator.\n\n"
                        + "eCounty Services");

        // If email delivery fails, the transaction should roll back.
        mailSender.send(message);
    }

    /**
     * Validates the activation token and sets the technician's password.
     */
    @Transactional
    public ActivationMessage activate(ActivateTechnicianRequest request) {

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
                || !activationToken.getExpiresAt().isAfter(Instant.now())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This activation link has expired. Contact your administrator "
                            + "for a new activation email");
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

        return new ActivationMessage(
                "Your technician account has been activated. You can now log in.");
    }

    /**
     * Requests a fresh activation email for an inactive technician.
     */
    @Transactional
    public void resendActivation(Long technicianId) {

        User technician = users.findById(technicianId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Technician account not found"));

        if (!"TECHNICIAN".equalsIgnoreCase(technician.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This account is not a technician account");
        }

        if (technician.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This technician account is already active");
        }

        issueAndSend(technician);
    }

    /**
     * Stores only the SHA-256 hash of the activation token.
     */
    private String hashToken(String token) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8));

            return java.util.HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is unavailable", exception);
        }
    }
}
