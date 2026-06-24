import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../hooks/useDebounce'

describe('useDebounce', () => {
  it('retorna el valor inicial inmediatamente', () => {
    const { result } = renderHook(() => useDebounce('hola', 300))
    expect(result.current).toBe('hola')
  })

  it('no actualiza el valor antes del delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hola' } }
    )
    rerender({ value: 'chau' })
    expect(result.current).toBe('hola')
    vi.useRealTimers()
  })

  it('actualiza el valor después del delay', async () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hola' } }
    )
    rerender({ value: 'chau' })
    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toBe('chau')
    vi.useRealTimers()
  })
})