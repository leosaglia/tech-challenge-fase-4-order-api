import { Decimal } from 'decimal.js'

import { Product } from '@core/enterprise/entities/product'
import { Category } from '@core/enterprise/valueObjects/category'
import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { CreateProductDto } from '@core/application/dtos/create-product-dto'

type CreateProductUseCaseResponse = {
  product: Product
}

export class CreateProductUseCase {
  constructor(private productGateway: IProductGateway) {}

  async execute({
    name,
    price,
    description,
    category,
  }: CreateProductDto): Promise<CreateProductUseCaseResponse> {
    const product = new Product(
      name,
      new Decimal(price),
      description,
      new Category(category),
    )

    await this.productGateway.create(product)

    return { product }
  }
}
