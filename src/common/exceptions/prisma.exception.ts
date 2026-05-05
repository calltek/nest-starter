import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { ERROR_CODES, ErrorCode } from './error-codes'

type PrismaExceptionResult = {
    status: number
    code: ErrorCode
    details?: Record<string, any>
}

export class PrismaException {
    exception: PrismaClientKnownRequestError

    constructor(exception: PrismaClientKnownRequestError) {
        this.exception = exception
    }

    getException(): PrismaExceptionResult {
        const prismaCode = this.exception.code
        const prismaNCode = parseInt(prismaCode.replace('P', ''), 10)

        if (prismaNCode >= 1000 && prismaNCode < 2000) {
            return {
                status: 500,
                code: ERROR_CODES.DB_CONNECTION_ERROR,
                details: { prismaCode },
            }
        }

        if (prismaCode === 'P2000') {
            return {
                status: 400,
                code: ERROR_CODES.FIELD_TOO_LONG,
                details: { column: this.getMeta('column_name') },
            }
        }

        if (prismaCode === 'P2001') {
            return {
                status: 404,
                code: ERROR_CODES.RECORD_NOT_FOUND,
                details: {
                    model: this.getMeta('model_name'),
                    argument: this.getMeta('argument_name'),
                    value: this.getMeta('argument_value'),
                },
            }
        }

        if (prismaCode === 'P2002') {
            return {
                status: 400,
                code: ERROR_CODES.UNIQUE_CONSTRAINT,
                details: { constraint: this.getMeta('constraint') },
            }
        }

        if (prismaCode === 'P2003') {
            return {
                status: 400,
                code: ERROR_CODES.INTEGRITY_CONSTRAINT,
                details: { field: this.getMeta('field_name') },
            }
        }

        if (prismaCode === 'P2025') {
            return {
                status: 404,
                code: ERROR_CODES.RECORD_NOT_FOUND,
            }
        }

        return {
            status: 500,
            code: ERROR_CODES.UNKNOWN_ERROR,
            details: { prismaCode },
        }
    }

    private getMeta(key: string) {
        const value: any = this.exception.meta ? this.exception.meta[key] : ''
        return value
    }
}
