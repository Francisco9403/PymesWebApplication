package com.backend.app.exception;

import java.time.LocalDateTime;
import java.util.List;

public record ApiError(
        String message,
        String errorCode,
        int status,
        LocalDateTime timestamp,
        String path,
        List<String> details
) {}