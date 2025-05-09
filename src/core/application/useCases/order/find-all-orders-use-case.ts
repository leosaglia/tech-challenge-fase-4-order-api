import { Order } from '@core/enterprise/entities/order'
import { Product } from '@core/enterprise/entities/product'
import { IOrderGateway } from '@core/application/interfaces/gateway/order-gateway-interface'
import { FindProductByIdUseCase } from '@core/application/useCases/product/find-product-by-id-use-case'

type FindOrdersUseCaseResponse = {
  orders: Array<{
    order: Order
    products: Product[]
  }>
}

export class FindAllOrdersUseCase {
  constructor(
    private orderGateway: IOrderGateway,
    private findProductByIdUseCase: FindProductByIdUseCase,
  ) {}

  async execute(): Promise<FindOrdersUseCaseResponse> {
    const orders = await this.orderGateway.findMany()
    const ordersWithItemsAndProducts: {
      order: Order
      products: Product[]
    }[] = []

    for (const order of orders) {
      const allOrderProducts = await Promise.all(
        order.getItems().map(async (item) => {
          const { product } = await this.findProductByIdUseCase.execute(
            item.getProductId(),
          )

          return product
        }),
      )

      ordersWithItemsAndProducts.push({
        order,
        products: allOrderProducts,
      })
    }

    const notFinishedOrders = ordersWithItemsAndProducts.filter(
      ({ order }) => order.getStatus() !== 'Finalizado',
    )

    // ordenação dos pedidos por status e data de criação
    notFinishedOrders.sort((a, b) => {
      const statusOrder = {
        Pronto: 1,
        'Em preparação': 2,
        Recebido: 3,
      }
      const comparisonStatusResult =
        statusOrder[a.order.getStatus()] - statusOrder[b.order.getStatus()]

      if (comparisonStatusResult !== 0) {
        // se os status forem diferentes, reordena pelo status
        return comparisonStatusResult
      }

      return (
        new Date(a.order.getCreatedAt()).getTime() -
        new Date(b.order.getCreatedAt()).getTime()
      )
    })

    return { orders: notFinishedOrders }
  }
}
