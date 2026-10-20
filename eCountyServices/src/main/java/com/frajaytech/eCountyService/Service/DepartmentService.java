
package com.frajaytech.eCountyService.Service;

import com.frajaytech.eCountyService.Dto.DepartmentDtos.CreateDepartmentRequest;
import com.frajaytech.eCountyService.Dto.DepartmentDtos.DepartmentResponse;
import com.frajaytech.eCountyService.Entity.Department;
import com.frajaytech.eCountyService.Repository.DepartmentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departments;

    public DepartmentService(DepartmentRepository departments) {
        this.departments = departments;
    }

    /**
     * Create a new department.
     */
    @Transactional
    public DepartmentResponse create(CreateDepartmentRequest input) {
        String code = input.code().trim().toUpperCase();
        String name = input.name().trim();

        if (code.isBlank() || name.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Department code and name are required"
            );
        }

        if (departments.existsByCodeIgnoreCase(code)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Department code already exists"
            );
        }

        if (departments.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Department name already exists"
            );
        }

        Department department = new Department();
        department.setCode(code);
        department.setName(name);

        department.setDescription(
                input.description() == null
                        || input.description().isBlank()
                        ? null
                        : input.description().trim()
        );

        // Department.active defaults to true in the entity.
        Department savedDepartment = departments.save(department);

        return toResponse(savedDepartment);
    }

    /**
     * Return all departments, including inactive departments.
     */
    @Transactional(readOnly = true)
    public List<DepartmentResponse> findAll() {
        return departments.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Activate or deactivate an existing department.
     */
    @Transactional
    public DepartmentResponse updateActiveStatus(
            Long id,
            boolean active
    ) {
        Department department = departments.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Department not found"
                ));

        department.setActive(active);

        Department updatedDepartment = departments.save(department);

        return toResponse(updatedDepartment);
    }

    /**
     * Convert a Department entity to its response DTO.
     */
    private DepartmentResponse toResponse(Department department) {
        return new DepartmentResponse(
                department.getId(),
                department.getCode(),
                department.getName(),
                department.getDescription(),
                department.isActive()
        );
    }
}
