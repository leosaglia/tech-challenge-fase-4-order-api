import { describe, it, expect, beforeEach, vi } from 'vitest'
import Decimal from 'decimal.js'
import { ProductGateway } from './product-gateway'
import { Product } from '@core/enterprise/entities/product'
import { IProductDataSource } from '@core/application/interfaces/repository/product-data-source'
import { ProductMapper } from './mappers/product-mapper'
import { ProductDto } from '@core/application/dtos/product-dto'
import { Category } from '@core/enterprise/valueObjects/category'

describe('ProductGateway', () => {
  let dataSource: IProductDataSource
  let gateway: ProductGateway
  let product: Product
  let productDto: ProductDto

  beforeEach(() => {
    dataSource = {
      create: vi.fn(),
      edit: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findMany: vi.fn(),
    }
    gateway = new ProductGateway(dataSource)
    product = new Product(
      'productName',
      new Decimal(100),
      'description',
      new Category('lanche'),
    )

    productDto = {
      id: '1',
      name: 'productName',
      price: new Decimal(100),
      description: 'description',
      category: 'lanche',
    }
  })

  it('should call dataSource.create with mapped DTO', async () => {
    await gateway.create(product)
    expect(dataSource.create).toHaveBeenCalledWith(
      ProductMapper.toCreateProductDto(product),
    )
  })

  it('should call dataSource.edit with mapped DTO', async () => {
    await gateway.edit(product)
    expect(dataSource.edit).toHaveBeenCalledWith(
      ProductMapper.toEditProductDto(product),
    )
  })

  it('should call dataSource.delete with correct id', async () => {
    await gateway.delete('1')
    expect(dataSource.delete).toHaveBeenCalledWith('1')
  })

  it('should return mapped product if found by id', async () => {
    dataSource.findById = vi.fn().mockResolvedValue(productDto)
    const result = await gateway.findById('1')
    expect(dataSource.findById).toHaveBeenCalledWith('1')
    expect(result).toStrictEqual(ProductMapper.toDomain(productDto))
  })

  it('should return null if product not found by id', async () => {
    dataSource.findById = vi.fn().mockResolvedValue(null)
    const result = await gateway.findById('notfound')
    expect(result).toBeNull()
  })

  it('should map all returned products to domain in findMany', async () => {
    dataSource.findMany = vi.fn().mockResolvedValue([productDto, productDto])
    const result = await gateway.findMany({})
    expect(dataSource.findMany).toHaveBeenCalledWith({})
    expect(result).toEqual([
      ProductMapper.toDomain(productDto),
      ProductMapper.toDomain(productDto),
    ])
  })

  it('should pass query to findMany', async () => {
    dataSource.findMany = vi.fn().mockResolvedValue([])
    await gateway.findMany({ category: 'lanche' })
    expect(dataSource.findMany).toHaveBeenCalledWith({ category: 'lanche' })
  })
})
