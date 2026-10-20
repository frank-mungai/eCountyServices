
package com.frajaytech.eCountyService.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class DepartmentDtos {

    private DepartmentDtos() {}

    public record CreateDepartmentRequest(
            @NotBlank
            @Size(max = 20)
            String code,

            @NotBlank
            @Size(max = 120)
            String name,

            @Size(max = 500)
            String description
    ) {}

    public record DepartmentResponse(
            Long id,
            String code,
            String name,
            String description,
            boolean active
    ) {}
}
