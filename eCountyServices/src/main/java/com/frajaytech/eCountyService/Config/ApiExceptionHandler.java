
package com.frajaytech.eCountyService.Config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {

    /**
     * Handles validation errors from @Valid request bodies.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex
    ) {

        Map<String, String> fieldErrors =
                ex.getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .collect(Collectors.toMap(
                                error -> error.getField(),
                                error -> error.getDefaultMessage() == null
                                        ? "Invalid value"
                                        : error.getDefaultMessage(),
                                (first, duplicate) -> first,
                                LinkedHashMap::new
                        ));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Validation failed");
        response.put("errors", fieldErrors);

        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handles invalid arguments with a safe client-facing message.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(
            IllegalArgumentException ex
    ) {

        Map<String, String> response = new LinkedHashMap<>();
        response.put("message", "Invalid request");

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}
