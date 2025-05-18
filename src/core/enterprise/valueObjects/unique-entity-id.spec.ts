import { describe, it, expect } from 'vitest'
import { UniqueEntityId } from './unique-entity-id'

// Testa se gera um UUID automaticamente
describe('UniqueEntityId', () => {
  it('should generate a valid uuid if no value is provided', () => {
    const id = new UniqueEntityId()
    expect(id.toValue()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
  })

  it('should accept a custom value', () => {
    const custom = 'custom-id-123'
    const id = new UniqueEntityId(custom)
    expect(id.toValue()).toBe(custom)
    expect(id.toString()).toBe(custom)
    expect(id.getValue()).toBe(custom)
  })

  it('toString, toValue and getValue should return the same value', () => {
    const id = new UniqueEntityId('abc')
    expect(id.toString()).toBe('abc')
    expect(id.toValue()).toBe('abc')
    expect(id.getValue()).toBe('abc')
  })
})
