// Busca os jogos no servidor e desenha os cards dentro da div #colecao
function carregarJogos() {
  const container = document.getElementById('colecao');
  if (!container) return; // página sem área de catálogo

  fetch('/api/lista')
    .then((resposta) => resposta.json())
    .then((dados) => {
      container.innerHTML = ''; // Limpa o container antes de renderizar

      dados.forEach((jogo) => {
        container.innerHTML += `
          <div class="card">
            <div class="img">
              <img src="${jogo.imagem}" alt="${jogo.titulo}">
            </div>
            <div class="texto">
              <h3>${jogo.titulo}</h3>
              <p>${jogo.sinopse}</p>
              <span class="preco">R$ ${Number(jogo.valor).toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        `;
      });
    })
    .catch((erro) => console.error("Erro ao buscar os jogos:", erro));
}

carregarJogos();
