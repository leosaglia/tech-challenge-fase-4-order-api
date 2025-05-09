import { ProductDto } from '@core/application/dtos/product-dto'
import { Prisma, Product as PrismaProduct } from '@prisma/client'

export class PrismaProductMapper {
  static toDto(raw: PrismaProduct): ProductDto {
    return {
      name: raw.name,
      price: raw.price,
      description: raw.description,
      category: raw.category,
      id: raw.id,
    }
  }

  static toPersistence(
    product: ProductDto,
  ): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
    }
  }

  static toPersistenceUpdate(product: ProductDto): Prisma.ProductUpdateInput {
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
    }
  }
}
