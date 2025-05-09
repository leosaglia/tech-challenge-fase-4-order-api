import { IProductGateway } from '@core/application/interfaces/gateway/product-gateway-interface'
import { FindProductByIdUseCase } from './find-product-by-id-use-case'

type DeleteProductUseCaseResponse = null

export class DeleteProductUseCase {
  constructor(
    private productGateway: IProductGateway,
    private findProductByIdUseCase: FindProductByIdUseCase,
  ) {}

  async execute(productId: string): Promise<DeleteProductUseCaseResponse> {
    await this.findProductByIdUseCase.execute(productId)

    await this.productGateway.delete(productId)

    return null
  }
}
