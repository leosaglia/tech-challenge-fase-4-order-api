import { Product } from '@core/enterprise/entities/product'

export class ProductPresenter {
  private readonly id: string

  private readonly name: string

  private readonly description: string

  private readonly category: string

  private readonly price: string

  constructor(
    id: string,
    name: string,
    description: string,
    category: string,
    price: string,
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.category = category
    this.price = price
  }

  static present(product: Product): ProductPresenter {
    return new ProductPresenter(
      product.getId(),
      product.getName(),
      product.getDescription(),
      product.getCategory(),
      product.getPrice().toFixed(2),
    )
  }
}
