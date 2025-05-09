import Decimal from 'decimal.js'

export interface ProductDto {
  id: string
  name: string
  price: Decimal
  description: string
  category: string
}
