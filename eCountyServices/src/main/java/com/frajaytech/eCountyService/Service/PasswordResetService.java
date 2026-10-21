package com.frajaytech.eCountyService.Service;

import com.frajaytech.eCountyService.Entity.PasswordResetToken;
import com.frajaytech.eCountyService.Entity.User;
import com.frajaytech.eCountyService.Repository.PasswordResetTokenRepository;
import com.frajaytech.eCountyService.Repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class PasswordResetService {

    private static final Logger log =
            LoggerFactory.getLogger(PasswordResetService.class);

    private static final int TOKEN_EXPIRY_MINUTES = 15;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final HttpEmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            HttpEmailService emailService
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public void requestPasswordReset(String email) {
        String normalizedEmail = email.trim().toLowerCase();

        Optional<User> optionalUser =
                userRepository.findByEmail(normalizedEmail);

        // Do not disclose whether the email is registered.
        if (optionalUser.isEmpty()) {
            return;
        }

        User user = optionalUser.get();

        tokenRepository.deleteByUserId(user.getId());

        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUserId(user.getId());
        resetToken.setTokenHash(hashToken(rawToken));
        resetToken.setExpiresAt(
                LocalDateTime.now().plusMinutes(TOKEN_EXPIRY_MINUTES)
        );
        resetToken.setUsed(false);

        tokenRepository.save(resetToken);

        String baseUrl = frontendUrl.replaceAll("/+$", "");
        String resetLink = baseUrl + "/reset-password?token=" + rawToken;

        if (!emailService.isConfigured()) {
            log.error("Password reset email could not be sent: "
                    + "resend.api-key is not configured.");
            throw new IllegalStateException(
                    "Password reset email could not be sent."
            );
        }

        try {
            sendResetEmail(normalizedEmail, resetLink);
        } catch (RestClientException ex) {
            log.error(
                    "Password reset email could not be sent. "
                            + "Check the Resend configuration.",
                    ex
            );

            // Roll back token creation if email delivery fails.
            throw new IllegalStateException(
                    "Password reset email could not be sent."
            );
        }
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException(
                    "The reset link is invalid or has expired."
            );
        }

        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken =
                tokenRepository.findByTokenHash(tokenHash)
                        .orElseThrow(() -> new IllegalArgumentException(
                                "The reset link is invalid or has expired."
                        ));

        if (resetToken.isUsed()
                || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "The reset link is invalid or has expired."
            );
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "The reset link is invalid or has expired."
                ));

        user.setPasswordHash(passwordEncoder.encode(newPassword));

        // Clear failed-login lockout after successful password recovery.
        user.setFailedAttempts(0);
        user.setLockedUntil(null);

        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        // Prevent any other outstanding reset token for this account.
        tokenRepository.deleteByUserId(user.getId());
    }

    private void sendResetEmail(String email, String resetLink) {

        String html = """
                <div style="font-family:Arial,sans-serif;max-width:600px;
                            margin:auto;color:#1e293b;line-height:1.7">
                  <div style="background:#065f46;color:white;padding:24px;
                              border-radius:12px 12px 0 0">
                    <h2 style="margin:0">Murang'a County</h2>
                    <p style="margin:4px 0 0">eCounty Services Portal</p>
                  </div>
                  <div style="padding:28px;border:1px solid #e2e8f0">
                    <h2>Password reset request</h2>
                    <p>We received a request to reset the password for
                       your eCounty Services account.</p>
                    <p>Use the button below to choose a new password.
                       This link expires in 15 minutes and can only be
                       used once.</p>
                    <p style="margin:28px 0">
                      <a href="%s"
                         style="background:#065f46;color:white;
                                text-decoration:none;padding:13px 22px;
                                border-radius:8px;display:inline-block;
                                font-weight:bold">
                        Reset Password
                      </a>
                    </p>
                    <p>If the button does not work, open this link:</p>
                    <p style="overflow-wrap:anywhere">%s</p>
                    <p>If you did not request a password reset,
                       you can ignore this email.</p>
                  </div>
                  <p style="font-size:12px;color:#64748b;text-align:center">
                    Murang'a County eCounty Services
                  </p>
                </div>
                """.formatted(resetLink, resetLink);

        emailService.sendHtml(
                email,
                "Reset your eCounty Services password",
                html
        );
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(
                    rawToken.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);
        } catch (Exception ex) {
            throw new IllegalStateException(
                    "Unable to process reset token."
            );
        }
    }
}