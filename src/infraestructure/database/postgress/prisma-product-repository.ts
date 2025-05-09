import { ProductDto } from '@core/application/dtos/product-dto'
import { PrismaService } from '@infra/frameworks/prisma/prisma.service'
import { IProductDataSource } from '@core/application/interfaces/repository/product-data-source'
import { PrismaProductMapper } from './mappers/prisma-product-mapper'

export class PrismaProductRepository implements IProductDataSource {
  constructor(private prisma: PrismaService) {}

  async create(product: ProductDto): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)
    await this.prisma.product.create({
      data,
    })
  }

  async edit(product: ProductDto): Promise<void> {
    const data = PrismaProductMapper.toPersistenceUpdate(product)

    await this.prisma.product.update({
      where: { id: product.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    })
  }

  async findById(id: string): Promise<ProductDto | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDto(product)
  }

  async findMany(query: { category?: string }): Promise<ProductDto[]> {
    const { category } = query

    const products = await this.prisma.product.findMany()

    if (products && category) {
      return products
        .filter((product) => product.category === category)
        .map((product) => PrismaProductMapper.toDto(product))
    }

    return products.map((product) => PrismaProductMapper.toDto(product))
  }
}
