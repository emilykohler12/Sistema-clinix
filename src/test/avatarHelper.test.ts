import { describe, it, expect } from 'vitest'
import { getInitials, isValidAvatar, getAvatarColor } from '../utils/avatarHelper'

describe('getInitials', () => {
  it('devuelve las iniciales de un nombre completo', () => {
    expect(getInitials('Juan Pérez')).toBe('JP')
  })

  it('devuelve solo una inicial si hay un solo nombre', () => {
    expect(getInitials('Juan')).toBe('J')
  })

  it('maneja espacios extra al inicio y al final', () => {
    expect(getInitials('  Ana García  ')).toBe('AG')
  })

  it('devuelve máximo 2 iniciales aunque haya más palabras', () => {
    expect(getInitials('Juan Carlos García López')).toBe('JC')
  })

  it('maneja string vacío sin romper', () => {
    expect(getInitials('')).toBe('')
  })
})

describe('isValidAvatar', () => {
  it('retorna true si el avatar es una URL válida', () => {
    expect(isValidAvatar('https://ejemplo.com/foto.jpg')).toBe(true)
  })

  it('retorna false si el avatar es un objeto vacío', () => {
    expect(isValidAvatar({})).toBe(false)
  })

  it('retorna false si el avatar es un string vacío', () => {
    expect(isValidAvatar('')).toBe(false)
  })

  it('retorna false si el avatar es solo espacios', () => {
    expect(isValidAvatar('   ')).toBe(false)
  })
})

describe('getAvatarColor', () => {
  it('retorna siempre un string de clase de Tailwind', () => {
    expect(getAvatarColor('43')).toContain('bg-')
  })

  it('retorna el mismo color para el mismo ID', () => {
    expect(getAvatarColor('10')).toBe(getAvatarColor('10'))
  })

  it('maneja IDs no numéricos sin romper', () => {
    expect(() => getAvatarColor('abc')).not.toThrow()
  })
})