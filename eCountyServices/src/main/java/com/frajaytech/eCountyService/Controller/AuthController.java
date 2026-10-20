package com.frajaytech.eCountyService.Controller;

import com.frajaytech.eCountyService.Dto.Dtos;
import com.frajaytech.eCountyService.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;

    public AuthController(AuthService auth) { this.auth = auth; }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Dtos.MessageResponse register(@Valid @RequestBody Dtos.RegisterRequest r) { return auth.register(r); }

    @PostMapping("/login")
    public Dtos.AuthResponse login(@Valid @RequestBody Dtos.LoginRequest r) { return auth.login(r); }
}
