# language: pt
Funcionalidade: Cadastro de produto
  Como um administrador do fastfood
  Quero cadastrar um novo produto
  Para que ele fique disponível para venda

  Cenário: Criar um novo produto com sucesso
    Dado que eu informo os dados de um novo produto
      | nome        | descricao         | preco | categoria   |
      | Coca-Cola   | Refrigerante lata | 5.99  | bebida      |
    Quando eu envio a requisição de cadastro
    Então o produto deve ser criado com sucesso
    E a resposta deve conter o nome "Coca-Cola"
    E a resposta deve conter o preço "5.99"
