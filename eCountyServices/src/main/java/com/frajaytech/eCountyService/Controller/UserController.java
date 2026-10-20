package com.frajaytech.eCountyService.Controller;

import com.frajaytech.eCountyService.Dto.Dtos.UserDto;
import com.frajaytech.eCountyService.Service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final AuthService auth;
    public UserController(AuthService auth) { this.auth = auth; }

    @GetMapping("/me")
    public UserDto me(Authentication a) { return auth.me(Long.valueOf(a.getName())); }
}
