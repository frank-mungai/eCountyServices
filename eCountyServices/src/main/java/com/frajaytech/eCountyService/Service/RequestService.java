
package com.frajaytech.eCountyService.Service;

import com.frajaytech.eCountyService.Dto.RequestDtos.*;
import com.frajaytech.eCountyService.Entity.Department;
import com.frajaytech.eCountyService.Entity.ServiceRequest;
import com.frajaytech.eCountyService.Entity.ServiceRequest.Category;
import com.frajaytech.eCountyService.Entity.ServiceRequest.Status;
import com.frajaytech.eCountyService.Entity.User;
import com.frajaytech.eCountyService.Repository.DepartmentRepository;
import com.frajaytech.eCountyService.Repository.ServiceRequestRepository;
import com.frajaytech.eCountyService.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final ServiceRequestRepository requests;
    private final UserRepository users;
    private final DepartmentRepository departments;
    private final FileStorageService files;

    // ---------- Create request ----------

    @Transactional
    public RequestResponse create(
            Long userId,
            String category,
            String location,
            Double latitude,
            Double longitude,
            String description,
            String administrativeSubCounty,
            String constituency,
            String ward,
            String village,
            MultipartFile image) {

        User citizen = users.findById(userId)
                .orElseThrow(() ->
                        bad(HttpStatus.NOT_FOUND, "User not found"));

        String loc = location == null ? "" : location.trim();
        String desc = description == null ? "" : description.trim();

        if (loc.length() < 3 || loc.length() > 255) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Please enter the location of the problem");
        }

        if (desc.length() < 10 || desc.length() > 2000) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Please describe the problem (10 to 2000 characters)");
        }

        // Both coordinates must be provided together.
        if ((latitude == null) != (longitude == null)) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Send both latitude and longitude, or neither");
        }

        // Validate geographic coordinate ranges.
        if (latitude != null &&
                (latitude < -90 || latitude > 90 ||
                        longitude < -180 || longitude > 180)) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Invalid map coordinates");
        }

        ServiceRequest request = new ServiceRequest();

        request.setCitizen(citizen);
        request.setCategory(parseCategory(category));
        request.setLocation(loc);
        request.setLatitude(latitude);
        request.setLongitude(longitude);
        request.setDescription(desc);

        request.setAdministrativeSubCounty(
                cleanLocationPart(administrativeSubCounty, 100));

        request.setConstituency(
                cleanLocationPart(constituency, 100));

        request.setWard(
                cleanLocationPart(ward, 100));

        request.setVillage(
                cleanLocationPart(village, 150));

        request.setImagePath(files.store(image));

        return toDto(requests.save(request));
    }

    // ---------- Citizen requests ----------

    @Transactional(readOnly = true)
    public List<RequestResponse> mine(Long userId) {
        return requests
                .findByCitizenIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    // ---------- Retrieve one request ----------

    @Transactional(readOnly = true)
    public RequestResponse getOne(
            Long userId,
            boolean admin,
            Long id) {

        ServiceRequest request = requests.findById(id)
                .orElseThrow(() ->
                        bad(HttpStatus.NOT_FOUND, "Request not found"));

        // Do not expose another citizen's request.
        if (!admin &&
                !request.getCitizen().getId().equals(userId)) {
            throw bad(HttpStatus.NOT_FOUND, "Request not found");
        }

        return toDto(request);
    }

    // ---------- Administrator request list ----------

    @Transactional(readOnly = true)
    public List<RequestResponse> adminList(String status) {

        List<ServiceRequest> list;

        if (status == null ||
                status.isBlank() ||
                status.equalsIgnoreCase("ALL")) {

            list = requests.findAllByOrderByCreatedAtDesc();

        } else {
            list = requests.findByStatusOrderByCreatedAtDesc(
                    parseStatus(status));
        }

        return list.stream()
                .map(this::toDto)
                .toList();
    }

    // ---------- Assign department and technician ----------

    @Transactional
    public RequestResponse assign(
            Long requestId,
            AssignmentUpdate update) {

        if (update == null ||
                update.departmentId() == null ||
                update.technicianId() == null) {

            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Department and technician are required");
        }

        ServiceRequest request = requests.findById(requestId)
                .orElseThrow(() ->
                        bad(HttpStatus.NOT_FOUND, "Request not found"));

        Department department = departments.findById(
                        update.departmentId())
                .orElseThrow(() ->
                        bad(HttpStatus.NOT_FOUND, "Department not found"));

        if (!department.isActive()) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Cannot assign a request to an inactive department");
        }

        User technician = users.findById(update.technicianId())
                .orElseThrow(() ->
                        bad(HttpStatus.NOT_FOUND, "Technician not found"));

        if (!"TECHNICIAN".equalsIgnoreCase(technician.getRole())) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Selected user is not a technician");
        }

        if (!technician.isActive()) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Cannot assign a request to an inactive technician");
        }

        if (technician.getDepartment() == null ||
                !technician.getDepartment().getId()
                        .equals(department.getId())) {

            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Technician does not belong to the selected department");
        }

        request.setDepartment(department);
        request.setAssignedTechnician(technician);
        request.setAssignedAt(Instant.now());

        return toDto(requests.save(request));
    }

    // ---------- Update request status ----------

    @Transactional
    public RequestResponse updateStatus(
            Long id,
            StatusUpdate update) {

        ServiceRequest request = requests.findById(id)
                .orElseThrow(() ->
                        bad(HttpStatus.NOT_FOUND, "Request not found"));

        if (update == null || update.status() == null) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Status is required");
        }

        if (request.getStatus() == null) {
            throw bad(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Request has no current status");
        }

        // Prevent moving backwards through the current status sequence.
        if (update.status().ordinal() <
                request.getStatus().ordinal()) {

            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Status cannot move backwards");
        }

        request.setStatus(update.status());

        String note = update.adminNote();

        if (note != null && note.trim().length() > 1000) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Note is too long");
        }

        request.setAdminNote(
                note == null || note.isBlank()
                        ? null
                        : note.trim());

        if (update.status() == Status.RESOLVED &&
                request.getResolvedAt() == null) {

            request.setResolvedAt(Instant.now());
        }

        return toDto(requests.save(request));
    }

    // ---------- Analytics ----------

    @Transactional(readOnly = true)
    public Analytics analytics() {

        long pending = requests.countByStatus(Status.PENDING);
        long inProgress = requests.countByStatus(Status.IN_PROGRESS);
        long resolved = requests.countByStatus(Status.RESOLVED);

        List<CategoryCount> byCategory =
                requests.countByCategory()
                        .stream()
                        .map(row -> new CategoryCount(
                                ((Category) row[0]).name(),
                                ((Number) row[1]).longValue()))
                        .sorted(
                                Comparator.comparingLong(
                                                CategoryCount::count)
                                        .reversed())
                        .toList();

        return new Analytics(
                pending + inProgress + resolved,
                pending,
                inProgress,
                resolved,
                pending + inProgress,
                byCategory);
    }

    // ---------- Entity to response DTO ----------

    private RequestResponse toDto(ServiceRequest request) {

        Department department = request.getDepartment();
        User technician = request.getAssignedTechnician();

        return new RequestResponse(
                request.getId(),
                String.format("REQ-%05d", request.getId()),
                request.getCategory().name(),
                request.getLocation(),
                request.getAdministrativeSubCounty(),
                request.getConstituency(),
                request.getWard(),
                request.getVillage(),
                request.getLatitude(),
                request.getLongitude(),
                request.getDescription(),
                request.getImagePath() == null
                        ? null
                        : "/uploads/" + request.getImagePath(),
                request.getStatus().name(),
                request.getAdminNote(),
                request.getCitizen().getFullName(),
                request.getCitizen().getPhone(),
                request.getCreatedAt(),
                request.getUpdatedAt(),
                request.getResolvedAt(),

                department == null ? null : department.getId(),
                department == null ? null : department.getName(),
                technician == null ? null : technician.getId(),
                technician == null ? null : technician.getFullName(),
                request.getAssignedAt()
        );
    }

    // ---------- Helpers ----------

    private String cleanLocationPart(String value, int maxLength) {

        if (value == null || value.isBlank()) {
            return null;
        }

        String cleaned = value.trim();

        if (cleaned.length() > maxLength) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "A location field exceeds its maximum length of "
                            + maxLength + " characters");
        }

        return cleaned;
    }

    private Category parseCategory(String value) {
        try {
            return Category.valueOf(
                    value == null
                            ? ""
                            : value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Invalid category");
        }
    }

    private Status parseStatus(String value) {
        try {
            return Status.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw bad(
                    HttpStatus.BAD_REQUEST,
                    "Invalid status");
        }
    }

    private ResponseStatusException bad(
            HttpStatus status,
            String message) {

        return new ResponseStatusException(status, message);
    }
}
