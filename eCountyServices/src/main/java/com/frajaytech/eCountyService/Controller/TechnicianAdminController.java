
package com.frajaytech.eCountyService.Controller;

import com.frajaytech.eCountyService.Dto.TechnicianDtos.CreateTechnicianRequest;
import com.frajaytech.eCountyService.Dto.TechnicianDtos.TechnicianResponse;
import com.frajaytech.eCountyService.Service.TechnicianActivationService;
import com.frajaytech.eCountyService.Service.TechnicianAdminService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/technicians")
public class TechnicianAdminController {

    private final TechnicianAdminService service;
    private final TechnicianActivationService activationService;

    public TechnicianAdminController(
            TechnicianAdminService service,
            TechnicianActivationService activationService) {
        this.service = service;
        this.activationService = activationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TechnicianResponse create(
            @Valid @RequestBody CreateTechnicianRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<TechnicianResponse> list() {
        return service.findAll();
    }

    @PostMapping("/{id}/activation-email")
    public Map<String, String> resendActivation(
            @PathVariable("id") Long id) {

        activationService.resendActivation(id);

        return Map.of(
                "message",
                "Activation email request processed. Check the server logs if the email does not arrive."
        );
    }
}
