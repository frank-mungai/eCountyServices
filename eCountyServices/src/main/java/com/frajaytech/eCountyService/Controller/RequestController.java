
package com.frajaytech.eCountyService.Controller;

import com.frajaytech.eCountyService.Dto.RequestDtos.RequestResponse;
import com.frajaytech.eCountyService.Service.RequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService service;

    public RequestController(RequestService service) {
        this.service = service;
    }

    /**
     * Creates a new service request.
     * Supports an optional image and map coordinates.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public RequestResponse create(
            Authentication auth,
            @RequestParam("category") String category,
            @RequestParam("location") String location,
            @RequestParam(name = "latitude", required = false)
            Double latitude,
            @RequestParam(name = "longitude", required = false)
            Double longitude,
            @RequestParam("description") String description,
            @RequestParam(name = "image", required = false)
            MultipartFile image) {

        return service.create(
                userId(auth),
                category,
                location,
                latitude,
                longitude,
                description,
                image
        );
    }

    /**
     * Returns service requests belonging to the authenticated user.
     */
    @GetMapping("/mine")
    public List<RequestResponse> mine(Authentication auth) {
        return service.mine(userId(auth));
    }

    /**
     * Returns one request.
     * Administrators can access requests belonging to other users,
     * subject to the authorization rules in RequestService.
     */
    @GetMapping("/{id}")
    public RequestResponse one(
            Authentication auth,
            @PathVariable("id") Long id) {

        boolean admin = auth.getAuthorities()
                .stream()
                .anyMatch(a ->
                        a.getAuthority().equals("ROLE_ADMIN"));

        return service.getOne(userId(auth), admin, id);
    }

    /**
     * Extracts the authenticated user's ID.
     */
    private Long userId(Authentication auth) {
        return Long.valueOf(auth.getName());
    }
}
