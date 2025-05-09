import { CreateProductDto } from '@core/application/dtos/create-product-dto'
import { EditProductDto } from '@core/application/dtos/edit-product-dto'
import { ProductDto } from '@core/application/dtos/product-dto'
import { Product } from '@core/enterprise/entities/product'
import { Category } from '@core/enterprise/valueObjects/category'

export class ProductMapper {
  static toDomain(productDto: ProductDto): Product {
    return new Product(
      productDto.name,
      productDto.price,
      productDto.description,
      new Category(productDto.category),
      productDto.id,
    )
  }

  static toEditProductDto(product: Product): EditProductDto {
    return {
      id: product.getId().toString(),
      name: product.getName(),
      description: product.getDescription(),
      price: product.getPrice(),
      category: product.getCategory(),
    }
  }

  static toCreateProductDto(product: Product): CreateProductDto {
    return {
      id: product.getId(),
      name: product.getName(),
      description: product.getDescription(),
      price: product.getPrice(),
      category: product.getCategory(),
    }
  }
}
