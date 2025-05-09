import { Product } from '@core/enterprise/entities/product'

export interface IProductGateway {
  create(product: Product): Promise<void>
  edit(product: Product): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Product | null>
  findMany(query: { category?: string }): Promise<Product[]>
}
