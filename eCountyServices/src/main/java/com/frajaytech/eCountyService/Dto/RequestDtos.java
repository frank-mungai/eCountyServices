
package com.frajaytech.eCountyService.Dto;

import com.frajaytech.eCountyService.Entity.ServiceRequest;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public class RequestDtos {

    public record RequestResponse(
            Long id,
            String reference,
            String category,
            String location,
            String administrativeSubCounty,
            String constituency,
            String ward,
            String village,
            Double latitude,
            Double longitude,
            String description,
            String imageUrl,
            String status,
            String adminNote,
            String citizenName,
            String citizenPhone,
            Instant createdAt,
            Instant updatedAt,
            Instant resolvedAt,

            // Assignment details
            Long departmentId,
            String departmentName,
            Long assignedTechnicianId,
            String assignedTechnicianName,
            Instant assignedAt
    ) {}

    public record StatusUpdate(
            @NotNull(message = "Status is required")
            ServiceRequest.Status status,

            @Size(max = 1000, message = "Note is too long")
            String adminNote
    ) {}

    public record AssignmentUpdate(
            @NotNull(message = "Department is required")
            Long departmentId,

            @NotNull(message = "Technician is required")
            Long technicianId
    ) {}

    public record CategoryCount(
            String category,
            long count
    ) {}

    public record Analytics(
            long total,
            long pending,
            long inProgress,
            long resolved,
            long open,
            List<CategoryCount> byCategory
    ) {}
}
