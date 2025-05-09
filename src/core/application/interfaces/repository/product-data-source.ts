import { CreateProductDto } from '@core/application/dtos/create-product-dto'
import { EditProductDto } from '@core/application/dtos/edit-product-dto'
import { ProductDto } from '@core/application/dtos/product-dto'

export interface IProductDataSource {
  create(product: CreateProductDto): Promise<void>
  edit(product: EditProductDto): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<ProductDto | null>
  findMany(query: { category?: string }): Promise<ProductDto[]>
}
