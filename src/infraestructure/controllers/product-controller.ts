import { CreateProductDto } from '@core/application/dtos/create-product-dto'
import { EditProductDto } from '@core/application/dtos/edit-product-dto'
import { ProductGateway } from '../gateway/product-gateway'
import { IProductDataSource } from '@core/application/interfaces/repository/product-data-source'
import { CreateProductUseCase } from '@core/application/useCases/product/create-product-use-case'
import { FindAllProductsUseCase } from '@core/application/useCases/product/find-all-products-use-case'
import { EditProductUseCase } from '@core/application/useCases/product/edit-product-use-case'
import { FindProductByIdUseCase } from '@core/application/useCases/product/find-product-by-id-use-case'
import { DeleteProductUseCase } from '@core/application/useCases/product/delete-product-use-case'
import { ProductPresenter } from '@infra/presenters/ProductPresenter'

export class ProductController {
  constructor(private readonly productDataSource: IProductDataSource) {}

  async createProduct(product: CreateProductDto): Promise<ProductPresenter> {
    const productGateway = new ProductGateway(this.productDataSource)
    const createProductUseCase = new CreateProductUseCase(productGateway)

    const { product: createdProduct } =
      await createProductUseCase.execute(product)

    return ProductPresenter.present(createdProduct)
  }

  async getAllProductsByCategory(
    category?: string,
  ): Promise<ProductPresenter[]> {
    const productGateway = new ProductGateway(this.productDataSource)
    const findAllProductsUseCase = new FindAllProductsUseCase(productGateway)

    const { products } = await findAllProductsUseCase.execute({
      category,
    })

    return products.map(ProductPresenter.present)
  }

  async updateProduct(product: EditProductDto): Promise<ProductPresenter> {
    const productGateway = new ProductGateway(this.productDataSource)
    const findProductByIdUseCase = new FindProductByIdUseCase(productGateway)
    const editProductUseCase = new EditProductUseCase(
      productGateway,
      findProductByIdUseCase,
    )

    const { product: updatedProduct } =
      await editProductUseCase.execute(product)

    return ProductPresenter.present(updatedProduct)
  }

  async deleteProduct(id: string): Promise<void> {
    const productGateway = new ProductGateway(this.productDataSource)
    const findProductByIdUseCase = new FindProductByIdUseCase(productGateway)
    const deleteProductUseCase = new DeleteProductUseCase(
      productGateway,
      findProductByIdUseCase,
    )

    await deleteProductUseCase.execute(id)
  }
}
