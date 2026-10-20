
package com.frajaytech.eCountyService.Controller;

import com.frajaytech.eCountyService.Dto.TechnicianDtos.CreateTechnicianRequest;
import com.frajaytech.eCountyService.Dto.TechnicianDtos.TechnicianResponse;
import com.frajaytech.eCountyService.Service.TechnicianAdminService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/technicians")
public class TechnicianAdminController {

    private final TechnicianAdminService service;

    public TechnicianAdminController(TechnicianAdminService service) {
        this.service = service;
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
}
