import { UserRole } from '@/common/schema'

export function getEmojiByRole(role: UserRole) {
    if (role === UserRole.OWNER) return '👑'
    if (role === UserRole.ADMIN) return '🛡️'
    if (role === UserRole.OPERATOR) return '🧑‍💻'
    if (role === UserRole.VIEWER) return '👀'
    if (role === UserRole.SERVICE) return '🤖'
    return '⁉️'
}
