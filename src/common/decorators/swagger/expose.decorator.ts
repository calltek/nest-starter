import { getEmojiByRole } from '@/common/helpers'
import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { UserRole } from '@/common/schema'
import { Expose } from 'class-transformer'

type ApiPropertyOptionsWithRoles = ApiPropertyOptions & {
    defaultRoles?: UserRole[]
}

export const NSGetProperty = (options: ApiPropertyOptionsWithRoles, roles: UserRole[] = []) => {
    if (roles.length === 0 && options.defaultRoles) {
        roles = options.defaultRoles
    }

    delete options.defaultRoles

    if (roles.length) {
        const htmlRoles = roles.map((role) => {
            const emoji = getEmojiByRole(role)
            return `\`${emoji}${role}\``
        })

        if (!options.description) options.description = ''

        options.description = `${options.description} ${htmlRoles.join(' ')}`.trim()

        return applyDecorators(Expose({ groups: roles }), ApiProperty(options))
    }

    return applyDecorators(ApiProperty(options))
}

export const NSPostProperty = (options: ApiPropertyOptionsWithRoles) => {
    delete options.defaultRoles

    return applyDecorators(ApiProperty(options))
}
