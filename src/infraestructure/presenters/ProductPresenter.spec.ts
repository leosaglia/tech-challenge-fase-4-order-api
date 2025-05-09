import { describe, it, expect } from 'vitest'
import { ProductPresenter } from './ProductPresenter'
import { makeProduct } from '@test/factories/product-factory'
import { Category } from '@core/enterprise/valueObjects/category'
import Decimal from 'decimal.js'

describe('ProductPresenter', () => {
  it('should return a ProductPresenter instance', () => {
    const product = makeProduct()
    const presenter = ProductPresenter.present(product)
    expect(presenter).toBeInstanceOf(ProductPresenter)
  })

  it('should map all fields correctly', () => {
    const product = makeProduct({
      id: 'prod-1',
      name: 'Test Product',
      description: 'A test product',
      category: new Category('lanche'),
      price: new Decimal(123.456),
    })
    const presenter = ProductPresenter.present(product)
    expect(presenter).toMatchObject({
      id: 'prod-1',
      name: 'Test Product',
      description: 'A test product',
      category: 'lanche',
      price: '123.46',
    })
  })
})
