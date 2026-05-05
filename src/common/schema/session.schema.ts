import { UserRole } from './role.schema'

export type UserSession = {
    id: number
    type: 'jwt' | 'service'
    username: string
    name: string
    role: UserRole
    org_id?: number
    org_role?: UserRole
}
