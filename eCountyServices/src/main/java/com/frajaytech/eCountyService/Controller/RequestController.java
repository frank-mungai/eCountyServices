
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public RequestResponse create(
            Authentication auth,

            @RequestParam("category")
            String category,

            @RequestParam("location")
            String location,

            @RequestParam(name = "latitude", required = false)
            Double latitude,

            @RequestParam(name = "longitude", required = false)
            Double longitude,

            @RequestParam("description")
            String description,

            @RequestParam(
                    name = "administrativeSubCounty",
                    required = false)
            String administrativeSubCounty,

            @RequestParam(name = "constituency", required = false)
            String constituency,

            @RequestParam(name = "ward", required = false)
            String ward,

            @RequestParam(name = "village", required = false)
            String village,

            @RequestParam(name = "image", required = false)
            MultipartFile image) {

        return service.create(
                userId(auth),
                category,
                location,
                latitude,
                longitude,
                description,
                administrativeSubCounty,
                constituency,
                ward,
                village,
                image
        );
    }

    @GetMapping("/mine")
    public List<RequestResponse> mine(Authentication auth) {
        return service.mine(userId(auth));
    }

    @GetMapping("/{id}")
    public RequestResponse one(
            Authentication auth,
            @PathVariable("id") Long id) {

        boolean admin = auth.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"));

        return service.getOne(userId(auth), admin, id);
    }

    private Long userId(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new org.springframework.web.server
                    .ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required");
        }

        try {
            return Long.valueOf(auth.getName());
        } catch (NumberFormatException exception) {
            throw new org.springframework.web.server
                    .ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authenticated user ID is invalid");
        }
    }
}
