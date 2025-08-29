// src/main/java/com/example/common/web/GlobalExceptionHandler.java
package com.example.common.web;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(SecurityException.class)
    public ApiError handleSecurity(SecurityException ex, HttpServletRequest req) {
        return ApiError.of(401, "UNAUTHORIZED", ex.getMessage(), req.getRequestURI());
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(AccessDeniedException.class)
    public ApiError handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
        return ApiError.of(403, "FORBIDDEN", ex.getMessage(), req.getRequestURI());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NotFoundException.class)
    public ApiError handleNotFound(NotFoundException ex, HttpServletRequest req) {
        return ApiError.of(404, "NOT_FOUND", ex.getMessage(), req.getRequestURI());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public ApiError handleBadRequest(IllegalArgumentException ex, HttpServletRequest req) {
        return ApiError.of(400, "BAD_REQUEST", ex.getMessage(), req.getRequestURI());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ApiError handleOthers(Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception", ex);
        return ApiError.of(500, "INTERNAL_ERROR", "Unexpected error", req.getRequestURI());
    }

    @Data @Builder
    static class ApiError {
        private int status; private String code; private String message; private String path;
        static ApiError of(int s, String c, String m, String p){
            return ApiError.builder().status(s).code(c).message(m).path(p).build();
        }
    }
}
