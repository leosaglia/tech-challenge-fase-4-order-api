# Makefile para LocalStack e criação de fila SQS

LOCALSTACK_CONTAINER_NAME=localstack
POSTGRES_CONTAINER_NAME=techchallenge-postgres
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=poc

up:
	docker run --rm -d 											\
		-p 127.0.0.1:4566:4566 -p 127.0.0.1:4510-4559:4510-4559 \
		--name $(LOCALSTACK_CONTAINER_NAME) 					\
		-v /var/run/docker.sock:/var/run/docker.sock 			\
		-e DEBUG=${DEBUG-} 										\
		-e PERSISTENCE=0 										\
		localstack/localstack:latest

	docker run --rm -d 									\
		-p 5432:5432 									\
		--name $(POSTGRES_CONTAINER_NAME) 				\
		-e POSTGRES_USER=$(POSTGRES_USER) 			\
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) 	\
		-e POSTGRES_DB=$(POSTGRES_DB) 				\
		postgres:latest

create-queue:
	aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name processed-payment-queue
	aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name created-order-queue
	aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name created-customer-queue

create-env-file:
	echo "AWS_ACCESS_KEY_ID=localstack" > .env
	echo "AWS_SECRET_ACCESS_KEY=localstack" >> .env
	echo "POSTGRES_URL=postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@localhost:5432/$(POSTGRES_DB)" >> .env
	echo "AWS_REGION=us-east-1" >> .env
	echo "AWS_LOCAL_ENDPOINT=http://localhost:4566" >> .env
	echo "ENVIRONMENT=local" >> .env
	PROCESSED_PAYMENT_QUEUE_URL=$$(aws --endpoint-url=http://localhost:4566 sqs get-queue-url --queue-name processed-payment-queue --output text --query 'QueueUrl'); \
	echo "PROCESSED_PAYMENT_QUEUE_URL=$$PROCESSED_PAYMENT_QUEUE_URL" >> .env
	CREATED_ORDER_QUEUE_URL=$$(aws --endpoint-url=http://localhost:4566 sqs get-queue-url --queue-name created-order-queue --output text --query 'QueueUrl'); \
	echo "CREATED_ORDER_QUEUE_URL=$$CREATED_ORDER_QUEUE_URL" >> .env
	CREATED_CUSTOMER_QUEUE_URL=$$(aws --endpoint-url=http://localhost:4566 sqs get-queue-url --queue-name created-customer-queue --output text --query 'QueueUrl'); \
	echo "CREATED_CUSTOMER_QUEUE_URL=$$CREATED_CUSTOMER_QUEUE_URL" >> .env
	
setup-prisma-db:
	npx prisma generate
	npx prisma migrate deploy

down:
	docker stop $(LOCALSTACK_CONTAINER_NAME)
	docker stop $(POSTGRES_CONTAINER_NAME)
