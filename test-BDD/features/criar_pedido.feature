# language: pt
Funcionalidade: Cadastro de pedido
  Como um cliente
  Quero criar um novo pedido
  Para registrar minha compra

  Cenário: Criar um novo pedido com sucesso
    Dado que existe um produto cadastrado
    E que informo os dados de um novo pedido
      |  items                                         |
      |  [{"productId":"{id_produto}","quantity":2}]   |
    Quando eu envio a requisição de cadastro de pedido
    Então o pedido deve ser criado com sucesso
    E a resposta deve conter o id do pedido
    E a resposta deve conter os itens do pedido
