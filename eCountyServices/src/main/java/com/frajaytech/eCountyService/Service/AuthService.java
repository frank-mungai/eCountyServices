package com.frajaytech.eCountyService.Service;

import com.frajaytech.eCountyService.Dto.Dtos;
import com.frajaytech.eCountyService.Entity.User;
import com.frajaytech.eCountyService.Repository.UserRepository;
import com.frajaytech.eCountyService.Security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    private final int maxFailed;
    private final long lockMinutes;

    public AuthService(
            UserRepository users,
            PasswordEncoder encoder,
            JwtService jwt,
            @Value("${app.security.max-failed-attempts}") int maxFailed,
            @Value("${app.security.lock-minutes}") long lockMinutes) {

        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
        this.maxFailed = maxFailed;
        this.lockMinutes = lockMinutes;
    }

    // ---------- Register ----------

    @Transactional
    public Dtos.MessageResponse register(Dtos.RegisterRequest r) {

        String email = r.email().trim().toLowerCase();
        String idNumber = r.idNumber().trim();
        String phone = r.phone().trim();

        if (users.existsByEmail(email)) {
            throw bad(
                    HttpStatus.CONFLICT,
                    "Email already registered");
        }

        if (users.existsByIdNumber(idNumber)) {
            throw bad(
                    HttpStatus.CONFLICT,
                    "ID/passport number already registered");
        }

        if (users.existsByPhone(phone)) {
            throw bad(
                    HttpStatus.CONFLICT,
                    "Phone number already registered");
        }

        User user = new User();

        user.setFullName(r.fullName().trim());
        user.setIdNumber(idNumber);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPasswordHash(encoder.encode(r.password()));

        users.save(user);

        return new Dtos.MessageResponse(
                "Account created. You can now sign in.");
    }

    // ---------- Login ----------

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public Dtos.AuthResponse login(Dtos.LoginRequest r) {

        User user = users.findByEmail(
                        r.email().trim().toLowerCase())
                .orElseThrow(() ->
                        bad(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password"));

        Instant now = Instant.now();

        if (user.getLockedUntil() != null &&
                user.getLockedUntil().isAfter(now)) {
            throw bad(
                    HttpStatus.LOCKED,
                    "Account temporarily locked. Try again later.");
        }

        if (!encoder.matches(
                r.password(),
                user.getPasswordHash())) {

            int attempts = user.getFailedAttempts() + 1;
            user.setFailedAttempts(attempts);

            if (attempts >= maxFailed) {
                user.setLockedUntil(
                        now.plus(lockMinutes, ChronoUnit.MINUTES));

                user.setFailedAttempts(0);
            }

            users.save(user);

            throw bad(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password");
        }

        // Reset lockout state after successful authentication.
        user.setFailedAttempts(0);
        user.setLockedUntil(null);

        users.save(user);

        return new Dtos.AuthResponse(
                jwt.generate(user.getId(), user.getRole()),
                toDto(user));
    }

    // ---------- Current user ----------

    @Transactional(readOnly = true)
    public Dtos.UserDto me(Long id) {

        User user = users.findById(id)
                .orElseThrow(() ->
                        bad(
                                HttpStatus.NOT_FOUND,
                                "User not found"));

        return toDto(user);
    }

    // ---------- Entity to DTO ----------

    private Dtos.UserDto toDto(User user) {

        return new Dtos.UserDto(
                user.getId(),
                user.getFullName(),
                user.getIdNumber(),
                user.getEmail(),
                user.getPhone(),
                user.getRole());
    }

    // ---------- Error helper ----------

    private ResponseStatusException bad(
            HttpStatus status,
            String message) {

        return new ResponseStatusException(status, message);
    }
}
