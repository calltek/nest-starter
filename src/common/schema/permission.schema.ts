import { UserRole } from './role.schema'

/**
 * Closed permission catalog in `resource.action` format.
 *
 * Permissions are added module by module — when you create the agent module,
 * you add `agents.view`, `agents.create`, etc. here. The list will live in DB
 * later; for now it's hardcoded and TypeScript-checked against `Permission`.
 */
export const PERMISSIONS = [] as const

export type Permission = (typeof PERMISSIONS)[number]

/**
 * Pattern accepted by `@RequirePermission` and by a role's permission list.
 *   - Concrete permission:  'agents.execute'
 *   - Resource wildcard:    'agents.*'
 *   - Global wildcard:      '*'
 *   - Negation:             '!billing.edit'
 */
export type PermissionPattern = Permission | `${string}.*` | '*' | `!${string}`

/**
 * Mapping role → permission patterns.
 *
 * Patterns are evaluated in order; negations (`!x.y`) exclude specifically.
 *
 * Roles are added as features land — for now only OWNER (full access) and
 * SERVICE (scopes come from the token, not from the role).
 */
export const ROLE_PERMISSIONS: Partial<Record<UserRole, PermissionPattern[]>> = {
    [UserRole.OWNER]: ['*'],
    [UserRole.SERVICE]: [],
}

/**
 * Check whether a list of patterns covers a concrete permission.
 * Supports:
 *   - Exact match:        'agents.execute'
 *   - Resource wildcard:  'agents.*'
 *   - Global wildcard:    '*'
 *   - Negations:          '!billing.edit' (excludes even if another pattern matches)
 */
export function hasPermission(patterns: PermissionPattern[], required: Permission): boolean {
    let allowed = false

    for (const pattern of patterns) {
        if (pattern.startsWith('!')) {
            const negated = pattern.slice(1)
            if (matches(negated, required)) allowed = false
            continue
        }
        if (matches(pattern, required)) allowed = true
    }

    return allowed
}

function matches(pattern: string, required: string): boolean {
    if (pattern === '*') return true
    if (pattern === required) return true
    if (pattern.endsWith('.*')) {
        const prefix = pattern.slice(0, -2)
        return required.startsWith(`${prefix}.`)
    }
    return false
}

/**
 * Resolve the effective permissions for a role.
 * SERVICE returns [] — its scopes come from the token, not from the role.
 */
export function getRolePermissions(role: UserRole): PermissionPattern[] {
    return ROLE_PERMISSIONS[role] ?? []
}
