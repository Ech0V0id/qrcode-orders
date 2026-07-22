const express = require('express');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Banco de dados em memória (simulado)
let mesas = [];
let pedidos = [];
let cardapio = [
    { id: 1, nome: 'Hambúrguer', preco: 25.90, categoria: 'Lanches' },
    { id: 2, nome: 'Batata Frita', preco: 15.90, categoria: 'Acompanhamentos' },
    { id: 3, nome: 'Refrigerante', preco: 6.90, categoria: 'Bebidas' },
    { id: 4, nome: 'Pizza', preco: 45.90, categoria: 'Pratos' },
    { id: 5, nome: 'Salada', preco: 18.90, categoria: 'Pratos' },
    { id: 6, nome: 'Suco Natural', preco: 8.90, categoria: 'Bebidas' },
    { id: 7, nome: 'Brownie', preco: 12.90, categoria: 'Sobremesas' },
    { id: 8, nome: 'Café', preco: 4.90, categoria: 'Bebidas' }
];

// Inicializa 50 mesas
for (let i = 1; i <= 50; i++) {
    mesas.push({ id: i, numero: i, status: 'disponivel' });
}

// Rota para gerar QR Code para uma mesa específica
app.get('/api/qr/:mesaId', async (req, res) => {
    const mesaId = req.params.mesaId;
    const url = `${req.protocol}://${req.get('host')}/pedido?mesa=${mesaId}`;
    
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(url);
        res.json({ 
            success: true, 
            qrCode: qrCodeDataUrl,
            url: url,
            mesaId: mesaId
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Rota para listar todas as mesas com QR Codes
app.get('/api/mesas', async (req, res) => {
    const mesasComQR = [];
    
    for (const mesa of mesas) {
        const url = `${req.protocol}://${req.get('host')}/pedido?mesa=${mesa.id}`;
        try {
            const qrCode = await QRCode.toDataURL(url);
            mesasComQR.push({
                ...mesa,
                qrCode: qrCode,
                url: url
            });
        } catch (error) {
            mesasComQR.push({
                ...mesa,
                error: error.message
            });
        }
    }
    
    res.json({ success: true, mesas: mesasComQR });
});

// Rota para obter o cardápio
app.get('/api/cardapio', (req, res) => {
    res.json({ success: true, cardapio: cardapio });
});

// Rota para criar um pedido
app.post('/api/pedidos', (req, res) => {
    const { mesaId, itens, observacoes } = req.body;
    
    if (!mesaId || !itens || itens.length === 0) {
        return res.status(400).json({ 
            success: false, 
            error: 'Mesa e itens são obrigatórios' 
        });
    }
    
    // Calcula o total do pedido
    let total = 0;
    const itensDetalhados = itens.map(item => {
        const produto = cardapio.find(p => p.id === item.produtoId);
        if (produto) {
            total += produto.preco * item.quantidade;
            return {
                ...item,
                nome: produto.nome,
                preco: produto.preco,
                subtotal: produto.preco * item.quantidade
            };
        }
        return item;
    });
    
    const novoPedido = {
        id: pedidos.length + 1,
        mesaId: parseInt(mesaId),
        itens: itensDetalhados,
        observacoes: observacoes || '',
        total: parseFloat(total.toFixed(2)),
        status: 'pendente',
        dataHora: new Date().toISOString()
    };
    
    pedidos.push(novoPedido);
    
    // Atualiza status da mesa
    const mesa = mesas.find(m => m.id === parseInt(mesaId));
    if (mesa) {
        mesa.status = 'ocupada';
    }
    
    res.json({ success: true, pedido: novoPedido });
});

// Rota para listar todos os pedidos (para a cozinha/admin)
app.get('/api/pedidos', (req, res) => {
    const { status, mesaId } = req.query;
    
    let pedidosFiltrados = [...pedidos];
    
    if (status) {
        pedidosFiltrados = pedidosFiltrados.filter(p => p.status === status);
    }
    
    if (mesaId) {
        pedidosFiltrados = pedidosFiltrados.filter(p => p.mesaId === parseInt(mesaId));
    }
    
    res.json({ success: true, pedidos: pedidosFiltrados });
});

// Rota para atualizar status do pedido
app.put('/api/pedidos/:pedidoId', (req, res) => {
    const { pedidoId } = req.params;
    const { status } = req.body;
    
    const pedido = pedidos.find(p => p.id === parseInt(pedidoId));
    
    if (!pedido) {
        return res.status(404).json({ success: false, error: 'Pedido não encontrado' });
    }
    
    pedido.status = status;
    pedido.dataAtualizacao = new Date().toISOString();
    
    // Se o pedido for concluído ou cancelado, libera a mesa
    if (status === 'concluido' || status === 'cancelado') {
        const mesa = mesas.find(m => m.id === pedido.mesaId);
        if (mesa) {
            mesa.status = 'disponivel';
        }
    }
    
    res.json({ success: true, pedido: pedido });
});

// Rota para obter detalhes de uma mesa
app.get('/api/mesas/:mesaId', (req, res) => {
    const mesa = mesas.find(m => m.id === parseInt(req.params.mesaId));
    
    if (!mesa) {
        return res.status(404).json({ success: false, error: 'Mesa não encontrada' });
    }
    
    res.json({ success: true, mesa: mesa });
});

// Página de rastrear pedido (cliente)
app.get('/rastrear', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rastrear.html'));
});

// Página inicial com lista de mesas e QR Codes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Página de fazer pedido (cliente)
app.get('/pedido', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pedido.html'));
});

// Painel administrativo (cozinha/admin)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Página inicial: http://localhost:${PORT}/`);
    console.log(`Painel admin: http://localhost:${PORT}/admin`);
});
