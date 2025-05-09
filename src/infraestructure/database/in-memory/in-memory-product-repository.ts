import { randomUUID } from 'node:crypto'

import { IProductDataSource } from '@core/application/interfaces/repository/product-data-source'
import { CreateProductDto } from '@core/application/dtos/create-product-dto'
import { EditProductDto } from '@core/application/dtos/edit-product-dto'
import { ProductDto } from '@core/application/dtos/product-dto'
import Decimal from 'decimal.js'

export class InMemoryProductRepository implements IProductDataSource {
  private products: ProductDto[] = [
    {
      category: 'bebida',
      description: 'A delicious pizza',
      id: '1',
      name: 'Pizza',
      price: new Decimal(10),
    },
  ]

  async create(product: CreateProductDto): Promise<void> {
    this.products.push({
      category: product.category,
      description: product.description,
      id: randomUUID(),
      name: product.name,
      price: product.price,
    })
  }

  async edit(product: EditProductDto): Promise<void> {
    const productIndex = this.products.findIndex((p) => p.id === product.id)

    this.products[productIndex] = {
      category: product.category,
      description: product.description,
      id: product.id,
      name: product.name,
      price: product.price,
    }
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.id !== id)
  }

  async findById(id: string): Promise<ProductDto | null> {
    return this.products.find((p) => p.id === id) || null
  }

  async findMany(query: { category?: string }): Promise<ProductDto[]> {
    const { category } = query
    const products = this.products

    if (!category) {
      return products
    }

    return this.products.filter((p) => p.category === category)
  }
}
