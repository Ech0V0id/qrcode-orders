# 🍽️ Sistema de Pedidos para Restaurantes com QR Code

Um sistema completo para restaurantes que gera QR Codes para as mesas e permite que os clientes façam pedidos diretamente pelo celular.

## 🚀 Funcionalidades

- **Geração de QR Codes**: Cada mesa possui um QR Code único que direciona o cliente para a página de pedidos
- **Cardápio Digital**: Clientes podem visualizar todos os itens do cardápio organizados por categoria
- **Pedidos Online**: Clientes selecionam itens, definem quantidades e enviam observações
- **Painel da Cozinha**: Interface administrativa para a equipe gerenciar todos os pedidos em tempo real
- **Controle de Mesas**: Status das mesas (disponível/ocupada) atualizado automaticamente
- **Fluxo de Pedidos**: Acompanhamento do status (pendente → preparando → pronto → concluído)

## 📁 Estrutura do Projeto

```
/workspace
├── server.js           # Servidor backend (Node.js + Express)
├── public/
│   ├── index.html      # Página inicial com QR Codes das mesas
│   ├── pedido.html     # Página do cliente para fazer pedidos
│   └── admin.html      # Painel administrativo da cozinha
├── package.json        # Dependências do projeto
└── README.md           # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js com Express
- **Geração de QR Code**: biblioteca qrcode
- **Frontend**: HTML5, CSS3, JavaScript puro
- **API**: RESTful

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm start
```

3. Acesse no navegador:
- **Página inicial**: http://localhost:3000/
- **Painel admin**: http://localhost:3000/admin

## 📱 Como Usar

### Para o Restaurante:
1. Acesse a página inicial (http://localhost:3000/)
2. Imprima os QR Codes de cada mesa
3. Cole os QR Codes nas respectivas mesas
4. Acompanhe os pedidos pelo painel da cozinha (http://localhost:3000/admin)

### Para o Cliente:
1. Escaneie o QR Code da mesa com o celular
2. Visualize o cardápio digital
3. Selecione os itens desejados
4. Adicione observações (opcional)
5. Envie o pedido

### Para a Cozinha:
1. Acesse o painel administrativo
2. Visualize todos os pedidos em tempo real
3. Atualize o status dos pedidos:
   - **Pendente** → **Preparando** → **Pronto** → **Concluído**
4. Os pedidos são atualizados automaticamente a cada 10 segundos

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/mesas` | Lista todas as mesas com QR Codes |
| GET | `/api/mesas/:id` | Obtém detalhes de uma mesa |
| GET | `/api/qr/:mesaId` | Gera QR Code para uma mesa específica |
| GET | `/api/cardapio` | Lista todos os itens do cardápio |
| POST | `/api/pedidos` | Cria um novo pedido |
| GET | `/api/pedidos` | Lista todos os pedidos |
| PUT | `/api/pedidos/:id` | Atualiza status de um pedido |

## 📝 Cardápio Padrão

O sistema já vem com um cardápio exemplo:
- Lanches: Hambúrguer
- Acompanhamentos: Batata Frita
- Pratos: Pizza, Salada
- Bebidas: Refrigerante, Suco Natural, Café
- Sobremesas: Brownie

## ⚙️ Configuração

Para modificar o cardápio, edite o array `cardapio` no arquivo `server.js`.

Para alterar o número de mesas, modifique o loop de inicialização no mesmo arquivo.

## 📄 Licença

ISC
