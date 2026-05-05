import { Request } from 'express'
import { UserSession } from '@/common/schema'

export interface NSRequest extends Request {
    startTime: number
    correlationId: string
    user: UserSession | null
}
