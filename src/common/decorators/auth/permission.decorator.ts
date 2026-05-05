import { SetMetadata, applyDecorators } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Permission } from '@/common/schema'

export const PERMISSION_METADATA_KEY = 'kuj:permission'

export const RequirePermission = (permission: Permission) => {
    return applyDecorators(ApiBearerAuth(), SetMetadata(PERMISSION_METADATA_KEY, permission))
}
