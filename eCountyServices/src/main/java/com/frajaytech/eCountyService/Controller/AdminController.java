package com.frajaytech.eCountyService.Controller;

import com.frajaytech.eCountyService.Dto.RequestDtos.Analytics;
import com.frajaytech.eCountyService.Dto.RequestDtos.RequestResponse;
import com.frajaytech.eCountyService.Dto.RequestDtos.StatusUpdate;
import com.frajaytech.eCountyService.Service.RequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Everything under /api/admin/** requires the ADMIN role (see SecurityConfig). */
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final RequestService service;

    public AdminController(RequestService service) { this.service = service; }

    @GetMapping("/requests")
    public List<RequestResponse> list(@RequestParam(name = "status", required = false) String status) {
        return service.adminList(status);
    }

    @PutMapping("/requests/{id}/status")
    public RequestResponse updateStatus(@PathVariable("id") Long id, @Valid @RequestBody StatusUpdate body) {
        return service.updateStatus(id, body);
    }

    @GetMapping("/analytics")
    public Analytics analytics() { return service.analytics(); }
}
