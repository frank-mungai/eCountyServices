
package com.frajaytech.eCountyService.Controller;

import com.frajaytech.eCountyService.Dto.DepartmentDtos.CreateDepartmentRequest;
import com.frajaytech.eCountyService.Dto.DepartmentDtos.DepartmentResponse;
import com.frajaytech.eCountyService.Service.DepartmentService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/departments")
public class DepartmentAdminController {

    private final DepartmentService service;

    public DepartmentAdminController(DepartmentService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DepartmentResponse create(
            @Valid @RequestBody CreateDepartmentRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<DepartmentResponse> list() {
        return service.findAll();
    }

    @PatchMapping("/{id}/active")
    public DepartmentResponse updateActiveStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {
        return service.updateActiveStatus(id, active);
    }
}
