import { describe, expect, it, beforeAll } from 'bun:test'
import { Test } from '@nestjs/testing'
import { AppController } from '@/app.controller'
import type { NSRequest } from '@/common/types'

describe('AppController', () => {
    let controller: AppController

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AppController],
        }).compile()

        controller = moduleRef.get(AppController)
    })

    it('ping devuelve nombre, versión y latencia', () => {
        const request = { startTime: Date.now() } as NSRequest

        const result = controller.ping(request)

        expect(result.name).toBe('API')
        expect(result.version).toMatch(/^\d+\.\d+\.\d+$/)
        expect(result.delay).toMatch(/^\d+ms$/)
    })
})
