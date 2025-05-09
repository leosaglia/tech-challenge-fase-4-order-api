# FastFood Tech Challenge

## 📜 Descrição da Aplicação

Esta aplicação é um desafio técnico para um sistema de gerenciamento de fast food.

É um projeto Node com Typescript, utiliza express para expor a API e Prisma como ORM para comunicação com banco de dados Postgres.

Possui configuração para gerar imagem Docker e criação de recursos kubernetes para consumo.

Essa versão da API é especifica para rodar com sucesso na AWS, caso queira rodar local, é necessário realizar algumas adaptações.

## 📌 Pré-requisitos

Antes de começar, certifique-se de ter os seguintes recursos configurados na AWS

- [tech-challenge-infra-vpc-e-cluster-eks](https://github.com/leosaglia/tech-challenge-infra-vpc-e-cluster-eks)
- [tech-challenge-fast-food-postgres](https://github.com/leosaglia/tech-challenge-fast-food-postgres)

Os seguintes tópicos são interessantes para conhecimento, mas não são essenciais para execução.
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node](https://nodejs.org/pt)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/docs/getting-started)

## 🎡 Workflow

Todo o deploy CI/CD é automatizado utilizado o github actions.

Segue o Github flow. Possui a branch main protegida, com as alterações sendo realizadas em outras branchs, e quando concluídas, são mergeadas para main através de um PR (pull request).

- O workflow de CI é definido em .github/workflows/ci.yml.
  - Ele realiza o build e test da aplicação para garantir a integridade
- O workflow de CD é definido em .github/workflows/cd.yml.
  - Gera uma nova imagem e publica no docker hub
  - Configura credenciais AWS para acessar serviços e fazer deploy.
  - Configura kube config
  - Aplica os recursos k8s através dos manifestos da pasta kubernetes-infra
  - Força a atualização da imagem no deployment da API
  - Valida rollout com sucesso

## ✨ Execução do projeto

### 🔆 Local

#### Pré requisitos
- Ter um banco postgres rodando localmente no docker. Pode se utilizar do docker compose para criar somente o postgres.
  - Criar um arquivo .env

    `POSTGRES_USER`: `postgres` (Nome de usuário para autenticação no banco de dados PostgreSQL).

    `POSTGRES_PASSWORD`: `postgrespass` (Senha para autenticação no banco de dados PostgreSQL).

    `POSTGRES_DB`: `techchallenge-fastfood` (Nome do banco de dados PostgreSQL a ser utilizado pela aplicação).

    `PGDATA`: `/data/datapostgres` (Diretório onde os dados do PostgreSQL serão armazenados).

    `PG_HOST`: `localhost:5432` (Endereço e porta do servidor PostgreSQL. Pode ser localhost:5432 para desenvolvimento local).

    `PORT`: `3001` (Porta na qual a aplicação será executada).

    `POSTGRES_URL`: `"postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${PG_HOST}/${POSTGRES_DB}?schema=public"` (URL de conexão completa para o banco de dados PostgreSQL, construída utilizando as variáveis acima).
  - Rodar o comando
    ```sh
    docker-compose up --build
    ```

#### Iniciar a aplicação
Para iniciar a aplicação, rode o comando:
```sh
npm run start:dev
```

Caso tenha subido com as configurações padrão mostradas no pré-requisitos, a aplicação estará disponível em:  
```sh
http://http://localhost:3001/api-docs/
```

### 🔆 Execução na AWS

Após todo o deploy automatizado ter sido realizado na AWS, conecte-se com cluster. 

É possível seguir este passo a passo para realizar a configuração:

https://docs.aws.amazon.com/pt_br/eks/latest/userguide/create-kubeconfig.html#create-kubeconfig-automatically

Após configurar o kube config para seu cluster EKS, siga os passos:

1. Liste seus pods para obter o nome do pod:
```sh
kubectl get pods
```

2. Faça o port forward de um dos pods para acessar a aplicação localmente:
```sh
kubectl port-forward <NOME_DO_POD> 3001:3001
```

Agora é possível acessar a aplicação em http://localhost:3001.

É possível consumir o serviço através do API Gateway caso o mesmo já esteja configurado.

## 📖 Documentação

### 🔆 Swagger
`http://http://localhost:3001/api-docs/`

Também podem ser feitas execuções através do arquivo `client.http` caso tenha a extensão **Rest Client** instalada no VS Code. Nele já contém algumas massas para execução.

### 🔆 Negócio

Pode ser feito cadastros de clientes, caso o cliente desejar, mas não é algo obrigatório. `[POST] /customers`.

Caso o cliente tenha optado pelo cadastro é possível se identificar através do CPF. `[GET] /customers/{cpf}`.

Para ser possível realizar um pedido, é necessário que existam produtos cadastrados para o cliente escolher. Para isso, estão dispostas as seguintes funcionalidades para os produtos:
- Criação do produto `[POST] /products`
- Edição do produto `[PUT] /products/{productId}`
- Listagem dos produtos `[GET] /products`. Podendo filtrá-los também por categoria `[GET] /products?category={category}`
- Deleção de produtos `[DELETE] /products/{productId}`

Com os produtos existindo, já é possível fazer um pedido `[POST] /orders` e realizar o pagamento do mesmo `[POST] /orders/{orderId}/payments`

Também é possível fazer um acompanhamento dos pedidos, se já estão em preparação, prontos e etc. `[GET] /orders`

### 🔆 Arquitetura
![Arquitetura Kubernetes](kubernetes-infra/arquitetura.png)
