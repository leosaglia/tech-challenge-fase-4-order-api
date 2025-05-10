import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ProductController } from './product-controller'
import { CreateProductDto } from '@core/application/dtos/create-product-dto'
import { EditProductDto } from '@core/application/dtos/edit-product-dto'
import { Product } from '@core/enterprise/entities/product'
import Decimal from 'decimal.js'
import { Category } from '@core/enterprise/valueObjects/category'
import { ProductPresenter } from '@infra/presenters/ProductPresenter'

vi.mock('@core/application/useCases/product/create-product-use-case', () => ({
  CreateProductUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue({
      product: new Product(
        'Test',
        new Decimal(10),
        'uma descricao grande',
        new Category('lanche'),
        '1',
      ),
    }),
  })),
}))
vi.mock(
  '@core/application/useCases/product/find-all-products-use-case',
  () => ({
    FindAllProductsUseCase: vi.fn().mockImplementation(() => ({
      execute: vi.fn().mockResolvedValue({
        products: [
          new Product(
            'Test',
            new Decimal(10),
            'uma descricao grande',
            new Category('lanche'),
            '1',
          ),
          new Product(
            'Test2',
            new Decimal(20),
            'uma descricao grande',
            new Category('bebida'),
            '2',
          ),
        ],
      }),
    })),
  }),
)
vi.mock('@core/application/useCases/product/edit-product-use-case', () => ({
  EditProductUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue({
      product: new Product(
        'Edited',
        new Decimal(15),
        'uma descricao grande',
        new Category('lanche'),
        '1',
      ),
    }),
  })),
}))
vi.mock(
  '@core/application/useCases/product/find-product-by-id-use-case',
  () => ({
    FindProductByIdUseCase: vi.fn().mockImplementation(() => ({})),
  }),
)
vi.mock('@core/application/useCases/product/delete-product-use-case', () => ({
  DeleteProductUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue(undefined),
  })),
}))

describe('ProductController', () => {
  const mockProductDataSource = {
    create: vi.fn(),
    edit: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
    findMany: vi.fn(),
  }

  let controller: ProductController

  beforeEach(() => {
    controller = new ProductController(mockProductDataSource)
  })

  it('should create a product and return a presenter', async () => {
    const dto: CreateProductDto = {
      name: 'Test',
      description: 'uma descricao grande',
      category: 'lanche',
      price: new Decimal(10),
    }
    const result = await controller.createProduct(dto)
    expect(result).toStrictEqual(
      new ProductPresenter(
        '1',
        'Test',
        'uma descricao grande',
        'lanche',
        '10.00',
      ),
    )
  })

  it('should get all products by category and return presenters', async () => {
    const result = await controller.getAllProductsByCategory('lanche')
    expect(result.length).toBe(2)
  })

  it('should update a product and return a presenter', async () => {
    const dto: EditProductDto = {
      id: '1',
      name: 'Edited',
      description: 'uma descricao grande',
      category: 'lanche',
      price: new Decimal(15),
    }
    const result = await controller.updateProduct(dto)
    expect(result).toBeInstanceOf(ProductPresenter)
  })

  it('should delete a product by id', async () => {
    await expect(controller.deleteProduct('1')).resolves.toBeUndefined()
  })
})
