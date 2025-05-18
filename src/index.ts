import PrismaCustomerRepository from '@infra/database/postgress/prisma-customer-repository'
import PrismaOrderRepository from '@infra/database/postgress/prisma-order-repository'
import { PrismaProductRepository } from '@infra/database/postgress/prisma-product-repository'
import { TechChallengeAPI } from '@infra/entrypoint/express/server'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import SqsClient from '@infra/entrypoint/sqs/config/sqs.config'
import { ProcessedPaymentListener } from '@infra/entrypoint/sqs/consumer/processed-payment-listener'
import { CreatedCustomerListener } from '@infra/entrypoint/sqs/consumer/created-customer-listener'

const sqsClient = new SqsClient()

const productDataSource = new PrismaProductRepository(new PrismaService())
const customerDataSource = new PrismaCustomerRepository(new PrismaService())
const orderDataSource = new PrismaOrderRepository(new PrismaService())

TechChallengeAPI.start(
  productDataSource,
  customerDataSource,
  orderDataSource,
  sqsClient,
)

// Inicia o listener do SQS
const paymentListener = new ProcessedPaymentListener(
  orderDataSource,
  productDataSource,
  customerDataSource,
  sqsClient,
)
paymentListener.listen().catch((err) => {
  console.error('Erro ao iniciar o listener SQS:', err)
})

const customerListener = new CreatedCustomerListener(
  customerDataSource,
  sqsClient,
)
customerListener.listen().catch((err) => {
  console.error('Erro ao iniciar o listener SQS:', err)
})
