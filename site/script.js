fetch('/api/lista')
  .then((resposta) => resposta.json())
  .then((dados) => {
    container.innerHTML = ''; // Limpa o container antes de renderizar

    dados.forEach(Newgame => {
      container.innerHTML += `
        <div class = "card">
          <div class = "texto">
            <h3 id="titulo">${Newgame.titulo}</h3>
            <p>${Newgame.descricao}</p>
          </div>
          <div class = "img">
            <img src="${Newgame.imagem}" alt="${Newgame.descImagem}">
          </div>
        </div>
      `;
    });
  })
  .catch((erro) => console.error("Erro ao buscar as obras:", erro));