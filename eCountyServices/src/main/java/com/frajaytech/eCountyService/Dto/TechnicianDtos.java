
package com.frajaytech.eCountyService.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class TechnicianDtos {

    private TechnicianDtos() {
    }

    public record CreateTechnicianRequest(
            @NotBlank
            @Size(max = 255)
            String fullName,

            @NotBlank
            @Size(max = 100)
            String idNumber,

            @NotBlank
            @Email
            @Size(max = 254)
            String email,

            @NotBlank
            @Size(max = 30)
            String phone,

            @NotNull
            Long departmentId
    ) {
    }

    public record TechnicianResponse(
            Long id,
            String fullName,
            String idNumber,
            String email,
            String phone,
            String role,
            boolean active,
            Long departmentId,
            String departmentName
    ) {
    }
}
