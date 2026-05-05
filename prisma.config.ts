import 'dotenv/config'
import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
    schema: path.join('src', 'providers', 'prisma', 'schema.prisma'),
    migrations: {
        path: path.join('src', 'providers', 'prisma', 'migrations'),
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
})
