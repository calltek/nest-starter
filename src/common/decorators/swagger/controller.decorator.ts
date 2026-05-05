import * as fs from 'fs'
import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiSecurity } from '@nestjs/swagger'
import {
    Permission,
    UserRole,
    ROLE_PERMISSIONS,
    getRolePermissions,
    hasPermission,
} from '@/common/schema'
import { RequirePermission } from '../auth/permission.decorator'

/**
 * Lists the roles that grant the required permission — only used to render
 * the role chips in the Swagger description.
 */
function rolesCoveringPermission(permission: Permission): UserRole[] {
    return (Object.keys(ROLE_PERMISSIONS) as UserRole[]).filter((role) =>
        hasPermission(getRolePermissions(role), permission)
    )
}

export const NSEndpointProperty = (id: string, summary: string, permission?: Permission) => {
    let description = ''
    const filePath = `src/docs/${id}.md`

    if (fs.existsSync(filePath)) {
        description = fs.readFileSync(filePath, 'utf8')
    }

    if (permission) {
        summary = `🔒 ${summary}`

        const roles = rolesCoveringPermission(permission)
        const rolesLine = roles.length
            ? `\`${permission}\` — ${roles.map((r) => `\`${r}\``).join(' ')}`
            : `\`${permission}\``

        description = `${rolesLine}\n\n${description}`.trim()

        return applyDecorators(
            RequirePermission(permission),
            ApiSecurity('JWT'),
            ApiOperation({
                operationId: id,
                summary,
                description,
            })
        )
    }

    summary = `🟩 ${summary}`

    return applyDecorators(
        ApiOperation({
            operationId: id,
            summary,
            description,
        })
    )
}
