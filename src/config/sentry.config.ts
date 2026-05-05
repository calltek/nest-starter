import * as Sentry from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

// Ensure to call this before requiring any other modules!
Sentry.init({
    dsn: process.env.SENTRY_DSN,

    integrations: [
        nodeProfilingIntegration(),
        Sentry.httpIntegration(),
        Sentry.requestDataIntegration(),
    ],

    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    profilesSampleRate: 1.0,
    defaultIntegrations: false,

    normalizeDepth: 6,
    maxValueLength: 1000,

    environment: process.env.NODE_ENV,
    release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,

    enabled: process.env.SENTRY_ENABLED === 'true',
    debug: false,
})

export default Sentry
