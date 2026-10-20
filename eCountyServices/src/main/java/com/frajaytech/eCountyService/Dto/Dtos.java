package com.frajaytech.eCountyService.Dto;

import jakarta.validation.constraints.*;

public class Dtos {
    public record RegisterRequest(
            @NotBlank(message = "Full name is required") String fullName,
            @NotBlank @Pattern(regexp = "^[A-Za-z0-9]{6,12}$", message = "ID/passport must be 6-12 letters or digits") String idNumber,
            @NotBlank @Email(message = "Enter a valid email address") String email,
            @NotBlank @Pattern(regexp = "^\\+?[0-9 \\-]{9,18}$", message = "Invalid phone number") String phone,
            @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password) {}

    public record LoginRequest(
            @NotBlank(message = "Email is required") @Email(message = "Enter a valid email address") String email,
            @NotBlank(message = "Password is required") String password) {}

    public record AuthResponse(String token, UserDto user) {}

    public record UserDto(Long id, String fullName, String idNumber, String email, String phone, String role) {}

    public record MessageResponse(String message) {}
}
