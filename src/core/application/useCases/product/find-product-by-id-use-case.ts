import { Product } from '@core/enterprise/entities/product'
import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { ProductNotFoundError } from '@core/enterprise/custom-exceptions/product-not-found'

type FindProductByIdUseCaseResponse = {
  product: Product
}

export class FindProductByIdUseCase {
  constructor(private productGateway: IProductGateway) {}

  async execute(productId: string): Promise<FindProductByIdUseCaseResponse> {
    const product = await this.productGateway.findById(productId)

    if (!product) {
      throw new ProductNotFoundError(`Product with id ${productId} not found.`)
    }

    return { product }
  }
}
