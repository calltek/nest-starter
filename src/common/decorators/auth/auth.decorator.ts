import { Permission, UserSession, getRolePermissions, hasPermission } from '@/common/schema'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
    (
        data: 'username' | 'type' | 'role' | 'id' | 'name' | 'org_id' | 'org_role' | undefined,
        ctx: ExecutionContext
    ) => {
        const request = ctx.switchToHttp().getRequest()
        const user: UserSession | null = request.user

        if (user && data) return user[data] || null
        return user
    }
)

export const HasPermission = createParamDecorator((required: Permission, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user: UserSession | null = request.user

    if (!user) return false

    const role = user.org_role || user.role
    return hasPermission(getRolePermissions(role), required)
})
