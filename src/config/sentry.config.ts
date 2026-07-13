import * as Sentry from '@sentry/nestjs'

// Ensure to call this before requiring any other modules!
// NOTE: no usamos @sentry/profiling-node — es un addon NAPI que crashea bajo Bun (uv_default_loop).
Sentry.init({
    dsn: process.env.SENTRY_DSN,

    integrations: [Sentry.httpIntegration(), Sentry.requestDataIntegration()],

    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    defaultIntegrations: false,

    normalizeDepth: 6,
    maxValueLength: 1000,

    environment: process.env.NODE_ENV,
    release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,

    enabled: process.env.SENTRY_ENABLED === 'true',
    debug: false,
})

export default Sentry
