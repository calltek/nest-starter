import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { Response } from 'express'
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/client'
import { ERROR_CODES, ERROR_MESSAGES, ErrorCode, defaultCodeForStatus } from './error-codes'
import { PrismaException } from './prisma.exception'
import Sentry from '@/config/sentry.config'

/**
 * Application-level exception. Use it whenever you want to throw with a
 * specific error code from the catalog:
 *
 *   throw new NSException(404)                       // → NOT_FOUND
 *   throw new NSException(404, 'AGENT_NOT_FOUND')
 *   throw new NSException(403, 'PERMISSION_DENIED', 'Custom override')
 */
export class NSException extends HttpException {
    public readonly httpStatus: number
    public readonly code: ErrorCode
    public readonly fallbackMessage: string

    constructor(status: number, code?: ErrorCode, fallbackMessage?: string) {
        const resolvedCode = code ?? defaultCodeForStatus(status)
        const resolvedMessage = fallbackMessage ?? ERROR_MESSAGES[resolvedCode]

        super(resolvedMessage, status)

        this.httpStatus = status
        this.code = resolvedCode
        this.fallbackMessage = resolvedMessage
        this.name = 'NSException'
    }
}

type Exceptions =
    | HttpException
    | PrismaClientKnownRequestError
    | PrismaClientValidationError
    | BadRequestException
    | NotFoundException
    | UnauthorizedException
    | ForbiddenException
    | NSException
    | Error

type ErrorPayload = {
    status: number
    code: ErrorCode
    message: string
    errors?: any[]
    details?: Record<string, any>
}

@Catch()
export class NSExceptionFilter implements ExceptionFilter {
    private $prismaLogger = new Logger(PrismaClientKnownRequestError.name)
    private $nsLogger = new Logger(NSException.name)
    private $httpLogger = new Logger(HttpException.name)

    catch(exception: Exceptions, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        const payload = this.buildPayload(exception)

        if (payload.status >= 500) {
            this.$nsLogger.debug('Upload error to Sentry...')

            const request = ctx.getRequest()

            Sentry.withScope((scope) => {
                scope.setExtra('code', payload.code)
                scope.setExtra('status', payload.status)
                scope.setExtra('message', payload.message)
                scope.setExtra('url', request.url)
                scope.setExtra('method', request.method)
                scope.setExtra('body', request.body)
                scope.setExtra('query', request.query)
                scope.captureException(exception)
            })
        }

        response.status(payload.status).json(payload)
    }

    private buildPayload(exception: Exceptions): ErrorPayload {
        // Prisma — known request errors (P2000, P2001, ...)
        if (exception instanceof PrismaClientKnownRequestError) {
            this.$prismaLogger.error(exception)

            const result = new PrismaException(exception).getException()
            return {
                status: result.status,
                code: result.code,
                message: ERROR_MESSAGES[result.code],
                details: result.details,
            }
        }

        // Prisma — schema/validation errors (typos in field names, etc.)
        if (exception instanceof PrismaClientValidationError) {
            this.$prismaLogger.error(exception)

            return {
                status: 500,
                code: ERROR_CODES.DB_VALIDATION_ERROR,
                message: ERROR_MESSAGES.DB_VALIDATION_ERROR,
            }
        }

        // NSException — explicit code path
        if (exception instanceof NSException) {
            this.$nsLogger.error(exception.fallbackMessage)
            return {
                status: exception.httpStatus,
                code: exception.code,
                message: exception.fallbackMessage,
            }
        }

        // class-validator failures
        if (exception instanceof BadRequestException) {
            this.$httpLogger.error('Validation failed')
            const exceptionResponse: any = exception.getResponse()
            const errors = Array.isArray(exceptionResponse?.message)
                ? exceptionResponse.message
                : undefined

            return {
                status: 400,
                code: ERROR_CODES.VALIDATION_FAILED,
                message: ERROR_MESSAGES.VALIDATION_FAILED,
                errors,
            }
        }

        // Plain Nest HttpExceptions (UnauthorizedException, ForbiddenException, NotFoundException…)
        if (exception instanceof HttpException) {
            const status = exception.getStatus()
            const code = defaultCodeForStatus(status)
            this.$httpLogger.error(ERROR_MESSAGES[code])

            return {
                status,
                code,
                message: ERROR_MESSAGES[code],
            }
        }

        // Anything else
        this.$nsLogger.error(exception)
        return {
            status: 500,
            code: ERROR_CODES.UNKNOWN_ERROR,
            message: ERROR_MESSAGES.UNKNOWN_ERROR,
        }
    }
}
