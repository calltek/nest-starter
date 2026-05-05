import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { PERMISSION_METADATA_KEY } from '@/common/decorators/auth/permission.decorator'
import {
    Permission,
    UserRole,
    getRolePermissions,
    hasPermission,
} from '@/common/schema'

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(JwtService) private $jwt: JwtService,
        @Inject(ConfigService) private $envConfig: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required = this.reflector.getAllAndOverride<Permission>(PERMISSION_METADATA_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (!required) return true

        const request = context.switchToHttp().getRequest()
        const bearerToken = request.headers.authorization || ''
        const token = bearerToken.split(' ')[1] || ''

        if (!token) throw new UnauthorizedException('User not logged in')

        // Service tokens (kujtk_*) — pendiente de módulo dedicado
        if (token.startsWith('kujtk_')) {
            // TODO: validar token y comprobar required ∈ token.scopes
            throw new UnauthorizedException('Service token validation not implemented yet')
        }

        // JWT humano
        try {
            const secret = this.$envConfig.get('auth.jwtSecretKey')
            const payload: { id: number; role: UserRole; org_role?: UserRole } =
                await this.$jwt.verifyAsync(token, { secret })

            if (!payload?.role) throw new UnauthorizedException('Invalid JWT body')

            const effectiveRole = payload.org_role || payload.role
            const patterns = getRolePermissions(effectiveRole)
            return hasPermission(patterns, required)
        } catch {
            throw new UnauthorizedException('User not logged in')
        }
    }
}
