import { CreateOrderUseCase } from '@core/application/useCases/order/create-order-use-case'
import { FindAllOrdersUseCase } from '@core/application/useCases/order/find-all-orders-use-case'
import { FindProductByIdUseCase } from '@core/application/useCases/product/find-product-by-id-use-case'
import { IdentifyCustomerByDocumentUseCase } from '@core/application/useCases/costumer/identify-customer-by-document-use-case'
import { IOrderDataSource } from '@core/application/interfaces/repository/order-data-source'
import { IProductDataSource } from '@core/application/interfaces/repository/product-data-source'
import { ICustomerDataSource } from '@core/application/interfaces/repository/customer-data-source'
import { OrderGateway } from '@infra/gateway/order-gateway'
import { ProductGateway } from '@infra/gateway/product-gateway'
import { CustomerGateway } from '@infra/gateway/customer-gateway'
import { OrderPresenter } from '@infra/presenters/OrderPresenter'
import { CreateOrderUseCaseDto } from '@core/application/dtos/create-order-use-case-dto'

export class OrderController {
  constructor(
    private readonly orderDataSource: IOrderDataSource,
    private readonly productDataSource: IProductDataSource,
    private readonly customerDataSource: ICustomerDataSource,
  ) {}

  async createOrder(order: CreateOrderUseCaseDto): Promise<OrderPresenter> {
    const orderGateway = new OrderGateway(this.orderDataSource)
    const productGateway = new ProductGateway(this.productDataSource)
    const customerGateway = new CustomerGateway(this.customerDataSource)

    const findProductByIdUseCase = new FindProductByIdUseCase(productGateway)
    const identifyCustomerByDocumentUseCase =
      new IdentifyCustomerByDocumentUseCase(customerGateway)

    const createOrderUseCase = new CreateOrderUseCase(
      orderGateway,
      findProductByIdUseCase,
      identifyCustomerByDocumentUseCase,
    )

    const { order: createdOrder, products } =
      await createOrderUseCase.execute(order)

    return OrderPresenter.present(createdOrder, products)
  }

  async findAllOrders(): Promise<OrderPresenter[]> {
    const orderGateway = new OrderGateway(this.orderDataSource)
    const productGateway = new ProductGateway(this.productDataSource)

    const findProductByIdUseCase = new FindProductByIdUseCase(productGateway)
    const findAllOrdersUseCase = new FindAllOrdersUseCase(
      orderGateway,
      findProductByIdUseCase,
    )

    const { orders } = await findAllOrdersUseCase.execute()

    return orders.map(({ order, products }) =>
      OrderPresenter.present(order, products),
    )
  }
}
