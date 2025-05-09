import { Order } from '@core/enterprise/entities/order'
import { Product } from '@core/enterprise/entities/product'
import { OrderItem } from '@core/enterprise/entities/orderItem'
import { CreateOrderUseCaseDto } from '@core/application/dtos/create-order-use-case-dto'
import { IOrderGateway } from '@core/application/interfaces/gateway/order-gateway-interface'
import { FindProductByIdUseCase } from '@core/application/useCases/product/find-product-by-id-use-case'
import { IdentifyCustomerByDocumentUseCase } from '@core/application/useCases/costumer/identify-customer-by-document-use-case'
import { InvalidOrderError } from '@core/enterprise/custom-exceptions/invalid-order'

type CreateOrderUseCaseResponse = {
  order: Order
  products: Product[]
}

export class CreateOrderUseCase {
  constructor(
    private orderGateway: IOrderGateway,
    private findProductByIdUseCase: FindProductByIdUseCase,
    private identifyCustomerByDocumentUseCase: IdentifyCustomerByDocumentUseCase,
  ) {}

  async execute({
    items,
    customerDocument,
  }: CreateOrderUseCaseDto): Promise<CreateOrderUseCaseResponse> {
    const order = new Order()
    const products: Product[] = []

    if (
      items.length === 0 ||
      !items.every((item) => item.productId && item.quantity)
    ) {
      throw new InvalidOrderError('You must pass products to create an order')
    }

    if (customerDocument) {
      const { customer } =
        await this.identifyCustomerByDocumentUseCase.execute(customerDocument)

      order.setCustomerId(customer.getId())
    }

    for (const item of items) {
      const { product } = await this.findProductByIdUseCase.execute(
        item.productId,
      )

      products.push(product)

      const orderItem = new OrderItem(
        item.productId,
        order.getId(),
        product.getPrice(),
        item.quantity,
      )
      order.addItem(orderItem)
    }

    await this.orderGateway.create(order)

    return { order, products }
  }
}
