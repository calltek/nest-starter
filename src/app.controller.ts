import { NSEndpointProperty } from '@/common/decorators'
import type { NSRequest } from '@/common/types'
import { Controller, Get, Logger, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('🏡 Home')
@Controller()
export class AppController {
    private readonly $logger = new Logger(AppController.name)

    @Get('/ping')
    @NSEndpointProperty('Ping', 'Ping')
    ping(@Req() request: NSRequest) {
        this.$logger.log('API PING')

        const version = process.env.npm_package_version || '0.0.0'
        const delay = Date.now() - request.startTime

        return {
            name: 'API',
            version,
            delay: `${delay}ms`,
        }
    }
}
