
package com.frajaytech.eCountyService.Controller;

import com.frajaytech.eCountyService.Service.PasswordResetService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(
            PasswordResetService passwordResetService
    ) {
        this.passwordResetService = passwordResetService;
    }

    public record ForgotPasswordRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Enter a valid email address")
            @Size(max = 254)
            String email
    ) {
    }

    public record ResetPasswordRequest(
            @NotBlank(message = "Reset token is required")
            String token,

            @NotBlank(message = "Password is required")
            @Size(min = 8, max = 72,
                    message = "Password must be between 8 and 72 characters")
            String password
    ) {
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        try {
            passwordResetService.requestPasswordReset(request.email());

            return ResponseEntity.ok(Map.of(
                    "message",
                    "If an account exists for that email, " +
                            "password reset instructions will be sent."
            ));
        } catch (IllegalStateException ex) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "message",
                    "We could not send the reset email. Please try again later."
            ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        try {
            passwordResetService.resetPassword(
                    request.token(),
                    request.password()
            );

            return ResponseEntity.ok(Map.of(
                    "message",
                    "Password reset successful. You can now sign in."
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", ex.getMessage()
            ));
        }
    }
}
