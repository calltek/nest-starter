import { describe, expect, it } from 'bun:test'
import { getEmojiByRole, ucFirst } from '@/common/helpers'
import { UserRole } from '@/common/schema'

describe('ucFirst', () => {
    it('capitaliza la primera letra', () => {
        expect(ucFirst('hola')).toBe('Hola')
    })

    it('devuelve cadena vacía para entradas vacías', () => {
        expect(ucFirst('')).toBe('')
    })

    it('no altera el resto del texto', () => {
        expect(ucFirst('hOLA mundo')).toBe('HOLA mundo')
    })
})

describe('getEmojiByRole', () => {
    it('devuelve el emoji de cada rol', () => {
        expect(getEmojiByRole(UserRole.OWNER)).toBe('👑')
        expect(getEmojiByRole(UserRole.ADMIN)).toBe('🛡️')
        expect(getEmojiByRole(UserRole.OPERATOR)).toBe('🧑‍💻')
        expect(getEmojiByRole(UserRole.VIEWER)).toBe('👀')
        expect(getEmojiByRole(UserRole.SERVICE)).toBe('🤖')
    })

    it('devuelve fallback para roles desconocidos', () => {
        expect(getEmojiByRole('unknown' as UserRole)).toBe('⁉️')
    })
})
