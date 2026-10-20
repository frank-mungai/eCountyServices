 package com.frajaytech.eCountyService.Controller;

import com.frajaytech.eCountyService.Dto.TechnicianActivationDtos.ActivateTechnicianRequest;
import com.frajaytech.eCountyService.Dto.TechnicianActivationDtos.ActivationMessage;
import com.frajaytech.eCountyService.Service.TechnicianActivationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianActivationController {

    private final TechnicianActivationService activationService;

    public TechnicianActivationController(
            TechnicianActivationService activationService) {
        this.activationService = activationService;
    }

    /**
     * Activates a technician account using the emailed token
     * and the password chosen by the technician.
     *
     * POST /api/technicians/activate
     */
    @PostMapping("/activate")
    public ResponseEntity<ActivationMessage> activateTechnician(
            @Valid @RequestBody ActivateTechnicianRequest request) {

        ActivationMessage response = activationService.activate(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }
}
