class Newgame {
    constructor(titulo, sinopse, imagem, valor) {
        this.titulo = titulo;
        this.sinopse = sinopse;
        this.imagem = imagem;
        this.valor = valor;
    }
}

const container = document.querySelector('.todosCards');


/*
fetch('/api/lista')
  .then((resposta) => resposta.json())
  .then((dados) => {
    container.innerHTML = ''; // Limpa o container antes de renderizar

    dados.forEach(obra => {
      container.innerHTML += `
        <div class = "card">
          <div class = "texto">
            <h3 id="titulo">${obra.titulo}</h3>
            <p>${obra.descricao}</p>
          </div>
          <div class = "img">
            <img src="${obra.imagem}" alt="${obra.descImagem}">
          </div>
        </div>
      `;
    });
  })
  .catch((erro) => console.error("Erro ao buscar as obras:", erro));
*/


const formulario = document.getElementById('formulario');

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Impede o recarregamento padrão da página

    // Captura os valores digitados nos inputs
    const tituloF = document.getElementById('titulo').value;
    const imagemF = document.getElementById('imagem').value;
    const descricaoImF = document.getElementById('descricao').value;
    const textoF = document.getElementById('paragrafo').value;

    // Instancia o objeto (atenção à ordem: titulo, descricao, imagem, descImagem)
    const novaObra = new ObraDeArte(tituloF, textoF, imagemF, descricaoImF);

    // Dispara a requisição POST para a API
    fetch('/api/lista', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaObra)
    })
    .then(resposta => resposta.json())
    .then(() => {
        alert('Obra enviada com sucesso!');
        formulario.reset();
        window.location.href = 'index.html'; // Redireciona para ver o card na galeria
    })
    .catch(erro => console.error("Erro ao enviar:", erro));
});