import Joi from 'joi'

const schema = Joi.object({
    // ENV
    NODE_ENV: Joi.string().valid('development', 'production', 'preview').default('production'),

    // API
    PORT: Joi.number().required(),
    VERBOSE: Joi.boolean(),
    BASE_URL: Joi.string().uri().required(),
    FRONTEND_URL: Joi.string().uri().required(),

    // DB
    DATABASE_URL: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),

    // AUTH
    JWT_SECRET_KEY: Joi.string().required(),

    // REDIS
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),

    // VAULT
    VAULT_MASTER_KEY: Joi.string().allow('').optional(),

    // SENTRY
    SENTRY_DSN: Joi.string().allow('').optional(),
    SENTRY_ENABLED: Joi.string().default('false').allow('true', 'false'),
})

const loader = () => {
    return {
        // ENV
        environment: process.env.NODE_ENV,
        baseUrl: process.env.BASE_URL,
        frontendUrl: process.env.FRONTEND_URL,
        isProduction: ['production'].includes((process.env.NODE_ENV || '').toLowerCase()),

        // API
        api: {
            port: process.env.PORT,
            verbose: process.env.VERBOSE,
        },

        // DB
        db: {
            url: process.env.DATABASE_URL,
            name: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
        },

        // AUTH
        auth: {
            jwtSecretKey: process.env.JWT_SECRET_KEY,
        },

        // REDIS
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        },

        // VAULT
        vault: {
            masterKey: process.env.VAULT_MASTER_KEY,
        },

        // SENTRY
        sentry: {
            dsn: process.env.SENTRY_DSN,
            enabled: process.env.SENTRY_ENABLED === 'true',
        },
    }
}

export const settingsConfig = {
    isGlobal: true,
    cache: true,
    load: [loader],
    validationSchema: schema,
}
