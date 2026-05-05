/**
 * Catalog of application-level error codes.
 *
 * These codes are returned in the `code` field of error responses and the
 * frontend maps them to localized user-facing messages via its own dictionary.
 *
 * The `message` field in responses is an English fallback meant for debug
 * tools, server logs, and clients that don't (yet) have a translation for
 * a given code.
 *
 * Conventions:
 *   - SCREAMING_SNAKE_CASE
 *   - Format: `RESOURCE_REASON` (e.g. AGENT_NOT_FOUND)
 *   - Generic codes (no resource) when the error is not tied to a specific entity
 *   - Codes never change once shipped — add new ones, don't rename
 */
export const ERROR_CODES = {
    // Generic
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    VALIDATION_FAILED: 'VALIDATION_FAILED',

    // Auth
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    PERMISSION_DENIED: 'PERMISSION_DENIED',

    // Database
    DB_CONNECTION_ERROR: 'DB_CONNECTION_ERROR',
    DB_VALIDATION_ERROR: 'DB_VALIDATION_ERROR',
    RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
    UNIQUE_CONSTRAINT: 'UNIQUE_CONSTRAINT',
    INTEGRITY_CONSTRAINT: 'INTEGRITY_CONSTRAINT',
    FIELD_TOO_LONG: 'FIELD_TOO_LONG',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

/**
 * English fallback messages for each code. Used as the `message` field of
 * error responses. Keep them short and free of per-request data — for
 * dynamic context use the `details` field of the response instead.
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
    UNKNOWN_ERROR: 'An unexpected error occurred',
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Access denied',
    VALIDATION_FAILED: 'Validation failed',

    INVALID_TOKEN: 'Invalid authentication token',
    TOKEN_EXPIRED: 'Authentication token expired',
    PERMISSION_DENIED: 'Permission denied',

    DB_CONNECTION_ERROR: 'Database connection error',
    DB_VALIDATION_ERROR: 'Database validation error',
    RECORD_NOT_FOUND: 'Record not found',
    UNIQUE_CONSTRAINT: 'A record with these values already exists',
    INTEGRITY_CONSTRAINT: 'Cannot perform this operation due to related records',
    FIELD_TOO_LONG: 'Field value is too long',
}

/**
 * Default code for a given HTTP status. Used by `NSException` when the caller
 * passes only a status without an explicit code.
 */
export function defaultCodeForStatus(status: number): ErrorCode {
    if (status === 400) return ERROR_CODES.BAD_REQUEST
    if (status === 401) return ERROR_CODES.UNAUTHORIZED
    if (status === 403) return ERROR_CODES.FORBIDDEN
    if (status === 404) return ERROR_CODES.NOT_FOUND
    return ERROR_CODES.UNKNOWN_ERROR
}
