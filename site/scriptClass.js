class Newgame {
    constructor(titulo, sinopse, imagem, valor) {
        this.titulo = titulo;
        this.sinopse = sinopse;
        this.imagem = imagem;
        this.valor = valor;
    }
}

const formulario = document.getElementById('formjogo');

if (formulario) {
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault(); // Impede o recarregamento padrão da página

        // Captura os valores digitados nos inputs (ids iguais aos do form.html)
        const titulo = document.getElementById('nome').value;
        const imagem = document.getElementById('imagem').value;
        const sinopse = document.getElementById('sinopse').value;
        const valor = Number(document.getElementById('preco').value);

        // Ordem do construtor: titulo, sinopse, imagem, valor
        const novoJogo = new Newgame(titulo, sinopse, imagem, valor);

        // Envia o jogo para a API
        fetch('/api/lista', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoJogo)
        })
            .then(resposta => resposta.json())
            .then(() => {
                formulario.reset();
                carregarJogos(); // Atualiza o catálogo embaixo do formulário
            })
            .catch(erro => console.error("Erro ao enviar:", erro));
    });
}
