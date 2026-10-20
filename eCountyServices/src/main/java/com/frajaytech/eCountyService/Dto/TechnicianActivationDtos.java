package com.frajaytech.eCountyService.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class TechnicianActivationDtos {

    private TechnicianActivationDtos() {
        // Utility class; do not instantiate.
    }

    /**
     * Request body submitted when a technician activates an account.
     */
    public record ActivateTechnicianRequest(

            @NotBlank(message = "Activation token is required")
            @Size(max = 256, message = "Invalid activation token")
            String token,

            @NotBlank(message = "Password is required")
            @Size(
                    min = 12,
                    max = 72,
                    message = "Password must contain between 12 and 72 characters"
            )
            String password,

            @NotBlank(message = "Please confirm your password")
            @Size(
                    min = 12,
                    max = 72,
                    message = "Password confirmation must contain between 12 and 72 characters"
            )
            String confirmPassword

    ) {
    }

    /**
     * Response returned after successful account activation.
     */
    public record ActivationMessage(
            String message
    ) {
    }
}
