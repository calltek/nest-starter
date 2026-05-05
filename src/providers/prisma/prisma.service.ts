import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly $logger = new Logger('💾 DB')

    constructor() {
        super({
            adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
        })
    }

    async onModuleInit() {
        await this.$connect()
            .then(() => {
                this.$logger.log('Connected to Database')
            })
            .catch((err) => {
                console.error("Can't connect to Database", err)
                process.exit(1)
            })
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}
