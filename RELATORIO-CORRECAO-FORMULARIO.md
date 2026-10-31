# Relatório: por que o jogo não aparecia depois de enviar o formulário

## O problema

Na página `form.html`, depois de preencher nome, URL da imagem, sinopse e preço e clicar em **Adicionar Jogo**, o jogo devia aparecer embaixo do formulário. Não aparecia nada. No console do navegador (F12) aparecia um erro apontando para a **linha 4**.

O erro não era em um lugar só. Eram **quatro erros em sequência**: corrigir um fazia o próximo aparecer. Este relatório explica cada um e mostra como evitar.

---

## Antes de tudo: como ler o erro do F12

Quando aparece um erro no console, ele mostra três informações importantes:

```
Uncaught ReferenceError: container is not defined      <- O QUE aconteceu
    at script.js:4                                     <- ONDE (arquivo:linha)
```

Repare no **nome do arquivo**. O erro estava em `script.js:4` (na pasta `site/`), e não no `index.js`. Os nomes parecem, mas são coisas bem diferentes:

| Arquivo | Onde roda | Onde aparecem os erros |
|---|---|---|
| `index.js` (raiz) | No **servidor** (Node/Express) | No **terminal** onde você rodou `node index.js` |
| `site/script.js`, `site/scriptClass.js` | No **navegador** | No **console do F12** |

> **Dica:** clique no nome do arquivo no erro do console (`script.js:4`). O navegador abre o arquivo direto na linha do problema.

Tipos de erro mais comuns:

- **`ReferenceError: x is not defined`**: você usou uma variável ou classe que não existe (ou que ainda não existe naquele momento).
- **`TypeError: Cannot read properties of null (reading 'value')`**: o `document.getElementById(...)` não achou o elemento e devolveu `null`. Quase sempre é um id escrito diferente no HTML e no JS.

---

## Erro 1: `container` usado antes de existir (o erro da linha 4)

**Como estava**

`form.html` carregava os scripts nesta ordem:

```html
<script src="script.js"></script>       <!-- 1º -->
<script src="scriptClass.js"></script>  <!-- 2º -->
```

`script.js` (roda primeiro):
```js
fetch('/api/lista')
  .then((resposta) => resposta.json())
  .then((dados) => {
    container.innerHTML = '';   // linha 4: container ainda não existe!
```

`scriptClass.js` (roda depois):
```js
const container = document.querySelector('.todosCards');
```

**O que estava errado**

1. **Ordem:** o `script.js` usava `container`, mas quem criava essa variável era o `scriptClass.js`, que só carrega depois. Os scripts rodam **na ordem em que aparecem no HTML**.
2. **Seletor errado:** mesmo que a ordem estivesse certa, `.todosCards` não existe no HTML. A div embaixo do formulário é:
   ```html
   <div id="colecao"></div>
   ```
   Então `querySelector('.todosCards')` devolveria `null`.

**Como ficou**

Cada arquivo pega os elementos de que precisa, no próprio arquivo, com o id certo:

```js
function carregarJogos() {
  const container = document.getElementById('colecao');
  if (!container) return; // se a página não tem essa div, não faz nada

  fetch('/api/lista')
    .then((resposta) => resposta.json())
    .then((dados) => {
      container.innerHTML = '';
      dados.forEach((jogo) => {
        container.innerHTML += `...card do jogo...`;
      });
    });
}

carregarJogos();
```

Colocar o código dentro de uma **função** tem outra vantagem: dá para chamar `carregarJogos()` de novo depois de cadastrar um jogo, para atualizar a lista.

**Lição:** um arquivo não deve depender de uma variável criada em outro arquivo que carrega depois. E sempre confira se o seletor (`#id` ou `.classe`) existe de verdade no HTML.

---

## Erro 2: ids no JavaScript diferentes dos ids no HTML

**Como estava**

O formulário (`form.html`) tem estes ids:

```html
<input    id="nome">
<input    id="imagem">
<textarea id="sinopse"></textarea>
<input    id="preco">
```

Mas o `scriptClass.js` procurava outros:

```js
const tituloF       = document.getElementById('titulo').value;     // não existe
const imagemF       = document.getElementById('imagem').value;     // ok
const descricaoImF  = document.getElementById('descricao').value;  // não existe
const textoF        = document.getElementById('paragrafo').value;  // não existe
```

Quando o id não existe, `getElementById` devolve `null`, e `null.value` dá erro:
`TypeError: Cannot read properties of null (reading 'value')`.

**Como ficou**

```js
const titulo  = document.getElementById('nome').value;
const imagem  = document.getElementById('imagem').value;
const sinopse = document.getElementById('sinopse').value;
const valor   = Number(document.getElementById('preco').value);
```

Também usamos `Number(...)` no preço, porque `.value` **sempre devolve texto** (string), até em `<input type="number">`.

**Lição:** o id no `getElementById('x')` tem que ser **exatamente igual** ao `id="x"` do HTML, com as mesmas letras maiúsculas e minúsculas. Quando copiar código de outro exercício, confira os ids um por um.

---

## Erro 3: classe que não existe (`ObraDeArte`)

**Como estava**

```js
class Newgame {                       // a classe criada se chama Newgame
    constructor(titulo, sinopse, imagem, valor) { ... }
}

const novaObra = new ObraDeArte(tituloF, textoF, imagemF, descricaoImF); // ObraDeArte?
```

Esse código veio de um exercício anterior (de obras de arte). A classe foi renomeada para `Newgame`, mas o `new` continuou com o nome antigo. Resultado: `ReferenceError: ObraDeArte is not defined`.

**Como ficou**

```js
// a ordem dos argumentos segue o constructor: titulo, sinopse, imagem, valor
const novoJogo = new Newgame(titulo, sinopse, imagem, valor);
```

**Lição:** quando reaproveitar código, use o **Ctrl+F** para procurar os nomes antigos (`Obra`, `obra`, `descImagem`...) e troque todos. Confira também se a **ordem dos argumentos** do `new` é a mesma do `constructor`.

---

## Erro 4: a página saía em vez de mostrar o jogo

**Como estava**

```js
.then(() => {
    alert('Obra enviada com sucesso!');
    formulario.reset();
    window.location.href = 'index.html'; // vai embora da página
})
```

O objetivo era mostrar o jogo **embaixo do formulário**, mas o código mandava o navegador para outra página.

**Como ficou**

```js
.then(() => {
    formulario.reset();   // limpa os campos
    carregarJogos();      // busca a lista de novo e redesenha os cards
})
```

---

## Detalhes menores que também foram arrumados

- **Os dados do servidor tinham outro formato.** O `index.js` guardava objetos com `descricao` e `descImagem` (do exercício de obras), mas o jogo usa `sinopse` e `valor`. O formato do objeto precisa ser **o mesmo** em todo lugar: na classe, no servidor e na hora de desenhar o card. Agora todos usam `titulo`, `sinopse`, `imagem` e `valor`.
- **O CSS usava `.formulario` (classe), mas no HTML é `id="formulario"`.** Por isso o estilo nunca era aplicado. No CSS, `.nome` é para `class="nome"` e `#nome` é para `id="nome"`.
- **Tinha um `</div>` sobrando** no `form.html`. O navegador costuma ignorar, mas pode bagunçar o layout.
- **O preço não aceitava centavos.** Um `<input type="number">` só aceita número inteiro, a não ser que você coloque `step="0.01"`.
- **Criei um `.gitignore` com `node_modules/`** para essa pasta enorme não ir para o GitHub. Quem baixar o projeto só precisa rodar `npm install`.

---

## Como o fluxo funciona agora

```
[form.html]  usuário preenche e clica "Adicionar Jogo"
     │
     ▼
scriptClass.js  → pega os valores dos inputs
                → cria new Newgame(...)
                → fetch POST /api/lista  (envia o jogo em JSON)
     │
     ▼
index.js (servidor) → lista.push(novoJogo) → responde { status: "sucesso" }
     │
     ▼
scriptClass.js  → formulario.reset() e carregarJogos()
     │
     ▼
script.js       → fetch GET /api/lista → desenha um card para cada jogo em #colecao
```

---

## Como testar

1. No terminal, na pasta do projeto:
   ```
   npm install
   node index.js
   ```
2. Abra `http://localhost:3000/form.html`.
   - Abra pelo endereço do servidor, **não** com dois cliques no arquivo. Se abrir o arquivo direto, o `fetch('/api/lista')` não tem servidor para responder.
3. Preencha o formulário e clique em **Adicionar Jogo**. O card aparece embaixo.
4. Deixe o F12 aberto na aba **Console**: não deve aparecer nenhum erro vermelho.

---

## Checklist para a próxima vez que "não aparecer nada"

1. Abra o **F12 → Console** e leia o erro: **qual arquivo** e **qual linha**.
2. Variável "is not defined"? Veja se ela foi criada **antes** de ser usada, e no arquivo certo.
3. Erro com `null`? Compare o id/seletor do JS com o HTML, letra por letra.
4. Use `console.log(...)` para ver o que está chegando. Por exemplo, `console.log(dados)` dentro do `.then` mostra o que o servidor devolveu.
5. Veja a aba **Network** do F12. Ela mostra se o `fetch` foi feito e o que o servidor respondeu.
6. Reaproveitou código de outro exercício? Procure os nomes antigos com Ctrl+F.

---

## Próximos passos (ideias)

- **Os jogos somem quando o servidor reinicia**, porque a `lista` fica só na memória. O próximo passo seria salvar num arquivo JSON ou num banco de dados.
- **Mostrar os jogos cadastrados também no `index.html`**, que hoje só tem os 4 jogos escritos direto no HTML. Bastaria uma `<div id="colecao">` lá também, porque o `script.js` já sabe preencher.
