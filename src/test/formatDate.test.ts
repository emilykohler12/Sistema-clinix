import { describe, it, expect } from 'vitest'
import { formatDate } from '../utils/formatDate'

describe('formatDate', () => {
  it('formatea una fecha ISO correctamente', () => {
    const result = formatDate('2023-03-06T10:24:04.110Z')
    expect(result).toContain('2023')
  })

  it('devuelve un string no vacío', () => {
    expect(formatDate('2024-01-15T00:00:00.000Z')).toBeTruthy()
  })

  it('no rompe con fechas de distintos años', () => {
    expect(() => formatDate('2026-06-19T00:00:00.000Z')).not.toThrow()
  })
})