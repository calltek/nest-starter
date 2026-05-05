import * as fs from 'fs'
import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const initSwagger = (app: INestApplication) => {
    const swaggerConfig = new DocumentBuilder()
        .setTitle('API')
        .addSecurity('JWT', {
            name: 'JWT token',
            type: 'http',
            scheme: 'bearer',
        })
        .setDescription('NestJS + Bun + Prisma starter')
        .setVersion(process.env.npm_package_version || '0.1.0')
        .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    fs.writeFileSync('./swagger.json', JSON.stringify(document))
}
