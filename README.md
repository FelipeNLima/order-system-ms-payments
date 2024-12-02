## Description

Projeto desenvolvido como trabalho final do curso Software Architecture da Pós-Tech Fiap 2024.

## Sistema de autoatendimento de fast food

Requisitos para o desenvolvimento do projeto

**Pedido**

Os clientes são apresentados a uma interface de seleção na qual podem optar por se identificarem via CPF, se cadastrarem com nome, e-mail ou não se identificar, podendo montar o combo na seguinte sequência, sendo todas elas opcionais: Lanche Acompanhamento Bebida Sobremesa Em cada etapa é exibido o nome, descrição e preço de cada produto.

**Pagamento**

O sistema deverá possuir uma opção de pagamento integrada para MVP. A forma de pagamento oferecida será via QRCode do Mercado Pago.

**Acompanhamento**

Uma vez que o pedido é confirmado e pago, ele é enviado para a cozinha para ser preparado. Simultaneamente deve aparecer em um monitor para o cliente acompanhar o progresso do seu pedido com as seguintes etapas: Recebido Em preparação Pronto Finalizado

**Entrega**

Quando o pedido estiver pronto, o sistema deverá notificar o cliente que ele está pronto para retirada. Ao ser retirado, o pedido deve ser atualizado para o status finalizado. Além das etapas do cliente, o estabelecimento precisa de um acesso administrativo:

**Gerenciar clientes**

Com a identificação dos clientes o estabelecimento pode trabalhar em campanhas promocionais.

**Gerenciar produtos e categorias**

Os produtos dispostos para escolha do cliente serão gerenciados pelo estabelecimento, definindo nome, categoria, preço, descrição e imagens. Para esse sistema teremos categorias fixas: Lanche Acompanhamento Bebida Sobremesa

**Acompanhamento de pedidos**

Deve ser possível acompanhar os pedidos em andamento e tempo de espera de cada pedido. As informações dispostas no sistema de pedidos precisarão ser gerenciadas pelo estabelecimento através de um painel administrativo.

## Link Video demonstração

[Link Video demonstração](https://www.youtube.com/watch?v=zTSFxMMnUKk)

## Arquitetura

![arquitetura](/arquitetura.png)

Nosso serviço OrdemSystem vai estar em EKS dentro da nuvem da AWS, os CRUD's dos endpoints serão feitos em um RDS na nuvem tambem.

Teremos uma conexão com o mercado pago, para a realização do pagamento do pedido, onde no fluxo de inbound é feita a requisição para gerar um QRcode de pagamento, e no fluxo de outbound recebemos a confirmação do pagamento do pedido em nosso webhook.

**Rodar Pod AWS**

```diff
01. Criar um cluester EKS na conta AWS
02. Criar um node
03. Fazer login na AWS via terminal
04. Executar o comando aws eks update-kubeconfig --name [NOME_DO_CLUSTER]
05. Ir até o diretório da pasta api-svc
06. Executar o comando kubectl apply -f api-svc.yml
06. Executar o comando kubectl apply -f configmap-api.yml
07. Executar o comando kubectl apply -f api-deployment.yml
08. Executar o portfoard da aplicação kubectl port-forward --address 0.0.0.0 api-deployment-76c6d54dcf-qrnjc 80:3000
```

**Rodar Pod local**

```diff
01. Startar o minikube local
02. Ir até o diretório da pasta api-svc
03. Executar o comando kubectl apply -f api-svc.yml
04. Executar o comando kubectl apply -f configmap-api.yml
05. Executar o comando kubectl apply -f api-deployment.yml
06. Executar o portfoard da aplicação kubectl port-forward --address 0.0.0.0 api-deployment-76c6d54dcf-qrnjc 80:3000
```

## Intruções de uso

- **01. Cadastro de usuário**

  > POST/customers

- **02. Cadastro das categorias**

  > POST/categories

- **03. Cadastro dos produtos**

  > POST/product
  >
  > Com as categorias dos produtos criada, chamar o endpoint de cadastro de produto, para cadastrar o produto com sua respectiva categoria.

- **04. Realização do pedido**

  > POST/orders
  >
  > Com as categorias e os produtos já cadastrados, chamar o endpoint de realização do pedido, para salvar o pedido feito.

- **05. Cadastro do pagamento**
  > POST/payments
  >
  > Para receber a confirmação do pedido, vamos receber uma requisição no webhook
  > Para construção do webhook utilizamos uma funcionalidade do nest.js que é o Event Emitter, quando criado um pedido é acionado um evento para fazer a confirmação do pagamento.

## Developers

- Author - [Felipe José do Nascimento Lima](https://www.linkedin.com/in/felipe-lima-00bb62171/)
- Author - [Victor Ivo Gomes Henrique](https://www.linkedin.com/in/victor-ivo-henrique-68557313a/)
- Author - [Rafael Zanatta Paes Landim](https://www.linkedin.com/in/rafael-landim-81b7aa1ab/)
