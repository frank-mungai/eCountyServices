
package com.frajaytech.eCountyService.Service;

import com.frajaytech.eCountyService.Dto.TechnicianDtos.CreateTechnicianRequest;
import com.frajaytech.eCountyService.Dto.TechnicianDtos.TechnicianResponse;
import com.frajaytech.eCountyService.Entity.Department;
import com.frajaytech.eCountyService.Entity.User;
import com.frajaytech.eCountyService.Repository.DepartmentRepository;
import com.frajaytech.eCountyService.Repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Locale;

@Service
public class TechnicianAdminService {

    private static final Logger logger =
            LoggerFactory.getLogger(TechnicianAdminService.class);

    private final UserRepository users;
    private final DepartmentRepository departments;
    private final PasswordEncoder encoder;
    private final TechnicianActivationService activationService;

    private final SecureRandom secureRandom = new SecureRandom();

    public TechnicianAdminService(
            UserRepository users,
            DepartmentRepository departments,
            PasswordEncoder encoder,
            TechnicianActivationService activationService) {

        this.users = users;
        this.departments = departments;
        this.encoder = encoder;
        this.activationService = activationService;
    }

    /**
     * Creates an inactive technician account and requests an activation email.
     *
     * The technician must activate the account and choose a permanent password
     * before logging in.
     */
    @Transactional
    public TechnicianResponse create(CreateTechnicianRequest input) {

        if (input == null) {
            throw error(
                    HttpStatus.BAD_REQUEST,
                    "Technician details are required");
        }

        if (input.fullName() == null
                || input.fullName().isBlank()) {

            throw error(
                    HttpStatus.BAD_REQUEST,
                    "Full name is required");
        }

        if (input.idNumber() == null
                || input.idNumber().isBlank()) {

            throw error(
                    HttpStatus.BAD_REQUEST,
                    "ID/passport number is required");
        }

        if (input.email() == null
                || input.email().isBlank()) {

            throw error(
                    HttpStatus.BAD_REQUEST,
                    "Email address is required");
        }

        if (input.phone() == null
                || input.phone().isBlank()) {

            throw error(
                    HttpStatus.BAD_REQUEST,
                    "Phone number is required");
        }

        if (input.departmentId() == null) {
            throw error(
                    HttpStatus.BAD_REQUEST,
                    "Department is required");
        }

        String fullName = input.fullName().trim();
        String idNumber = input.idNumber().trim();
        String email = input.email().trim().toLowerCase(Locale.ROOT);
        String phone = input.phone().trim();

        if (users.existsByEmail(email)) {
            throw error(
                    HttpStatus.CONFLICT,
                    "Email already registered");
        }

        if (users.existsByIdNumber(idNumber)) {
            throw error(
                    HttpStatus.CONFLICT,
                    "ID/passport number already registered");
        }

        if (users.existsByPhone(phone)) {
            throw error(
                    HttpStatus.CONFLICT,
                    "Phone number already registered");
        }

        Department department = departments.findById(input.departmentId())
                .orElseThrow(() -> error(
                        HttpStatus.NOT_FOUND,
                        "Department not found"));

        if (!department.isActive()) {
            throw error(
                    HttpStatus.BAD_REQUEST,
                    "Cannot assign a technician to an inactive department");
        }

        // Generate a random initial password.
        // The technician chooses a permanent password through activation.
        byte[] randomBytes = new byte[48];
        secureRandom.nextBytes(randomBytes);

        String temporaryPassword = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        User technician = new User();

        technician.setFullName(fullName);
        technician.setIdNumber(idNumber);
        technician.setEmail(email);
        technician.setPhone(phone);
        technician.setPasswordHash(
                encoder.encode(temporaryPassword));
        technician.setRole("TECHNICIAN");
        technician.setActive(false);
        technician.setDepartment(department);

        User saved = users.save(technician);

        /*
         * Attempt to issue the activation token and send the email.
         * The activation service handles mail delivery exceptions.
         */
        try {
            activationService.issueAndSend(saved);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (RuntimeException exception) {
            /*
             * Unexpected activation/database failures must be logged.
             * Do not silently claim that an activation token was issued.
             */
            logger.error(
                    "Technician account creation encountered an activation "
                            + "processing error. Technician ID: {}",
                    saved.getId(),
                    exception);

            throw exception;
        }

        logger.info(
                "Technician account created. Technician ID: {}, "
                        + "department ID: {}",
                saved.getId(),
                department.getId());

        return toResponse(saved);
    }

    /**
     * Returns all technician accounts, including inactive accounts.
     */
    @Transactional(readOnly = true)
    public List<TechnicianResponse> findAll() {

        return users.findAll()
                .stream()
                .filter(user ->
                        "TECHNICIAN".equalsIgnoreCase(user.getRole()))
                .map(this::toResponse)
                .toList();
    }

    /**
     * Converts a User entity into a TechnicianResponse DTO.
     */
    private TechnicianResponse toResponse(User user) {

        Department department = user.getDepartment();

        return new TechnicianResponse(
                user.getId(),
                user.getFullName(),
                user.getIdNumber(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive(),
                department == null ? null : department.getId(),
                department == null ? null : department.getName());
    }

    /**
     * Creates a consistent HTTP error.
     */
    private ResponseStatusException error(
            HttpStatus status,
            String message) {

        return new ResponseStatusException(status, message);
    }
}
