const express = require('express');
const app = express();

// Middleware essencial para ler o JSON vindo do formulário (POST)
app.use(express.json());

// Serve a pasta 'site' onde estão os arquivos estáticos (HTML, CSS, JS)
app.use(express.static('site'));

// Banco de dados temporário em memória RAM
let lista = [
    {
        titulo: "Resident Evil Requiem",
        sinopse: "Survival horror tenso com exploração e ação estratégica.",
        imagem: "https://uploads.jovemnerd.com.br/wp-content/uploads/2025/06/resident_evil_9__x1mk6q.jpg",
        valor: 299
    }
];

// Rota GET: Devolve a lista inteira para a página principal
app.get('/api/lista', (req, res) => {
    res.json(lista);
});

// Rota POST: Recebe um novo jogo do formulário e guarda no Array
app.post('/api/lista', (req, res) => {
    const novoJogo = req.body;
    lista.push(novoJogo);
    res.json({ status: "sucesso" });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("📌 Servidor escutando em http://localhost:3000");
});