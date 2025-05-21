# Tech-challenge-fase-4-order-api

## 📜 Descrição da Aplicação

Esta aplicação é um desafio técnico para um sistema de gerenciamento de fast food.

É um projeto Node com Typescript, utiliza express para expor a API e Prisma como ORM para comunicação com banco de dados Postgres.

Essa versão da API é especifica para rodar com sucesso na AWS, caso queira rodar local, é necessário realizar algumas adaptações.

## Pré-requisitos para rodar os testes BDD (Cucumber)

1. Crie um arquivo `.env` na raiz do projeto com a variável de conexão do banco:

```
POSTGRES_URL=postgresql://user:pass@localhost:5432/poc
```

2. Suba um container Docker com a imagem do Postgres utilizando as mesmas credenciais do `.env`:

Exemplo de comando:
```
docker run --name techchallenge-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=poc -p 5432:5432 -d postgres:16
```

3. Gere os artefatos do Prisma e execute as migrations:
```
npx prisma generate
npx prisma migrate deploy
```

4. Inicie a aplicação em modo desenvolvimento:
```
npm run start:dev
```

5. Execute os testes BDD com Cucumber:
```
npm run test:bdd
```