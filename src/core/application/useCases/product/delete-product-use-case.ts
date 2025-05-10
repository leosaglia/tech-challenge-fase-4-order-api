import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { FindProductByIdUseCase } from './find-product-by-id-use-case'

export class DeleteProductUseCase {
  constructor(
    private readonly productGateway: IProductGateway,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
  ) {}

  async execute(productId: string): Promise<null> {
    await this.findProductByIdUseCase.execute(productId)

    await this.productGateway.delete(productId)

    return null
  }
}
