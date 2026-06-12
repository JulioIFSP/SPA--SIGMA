/******************************************************************

 * SELECIONA A DIV PRINCIPAL DA PÁGINA
 
 * O QUE FAZ:
 Permite acessar o APP do HTML
 
 * POR QUE:
 Precisamos de um local para mostrar o conteúdo da SPA.
 
 * COMO:
 document.querySelector("#app") seleciona a div com id "app".
 
 ******************************************************************/
const app = document.querySelector("#app");


/******************************************************************
 *
 * ESTADO DA APLICAÇÃO
 *
 * O QUE FAZ:
Cria um objeto chamado estado para armazenar informações da SPA, 
com objetivo de manter dados que podem mudar durante a navegação, como a página atual e o número de acessos.
Define um objeto com propriedades pagina e acessos.

 ******************************************************************/
const estado = {

    // Página atual
    pagina: "home",

    // Quantidade de acessos
    acessos: 0

};


/******************************************************************
 *
 * CARREGA DADOS DO JSON
 *
 * O QUE FAZ:
Essa função busca o arquivo dados.json e guarda o resultado da requisição na constante resposta. 
Depois ela pega o JSON que veio nessa resposta, converte para um objeto JavaScript e guarda o resultado na constante dados. 
Por fim, retorna dados para quem chamou a função.
******************************************************************/


async function carregarDados() {

    const resposta = await fetch("dados.json");
    // Crie uma constante chamada resposta, busque o arquivo dados.json, 
    // espere ele chegar e guarde o resultado da requisição dentro de resposta.

    const dados = await resposta.json();
    // Crie uma constante chamada dados, converta a resposta para um objeto JavaScript,
    // espere a conversão terminar e guarde o resultado dentro de dados.

    return dados;
}


/******************************************************************
 *
 * CRIA UM CARD HTML
 *
 * O QUE FAZ:
 Cria um modelo de card usando template string, 
 onde o título e o texto são preenchidos por outras partes do código.
 Evita repetição de código e facilita a criação de novos cards.

 ******************************************************************/
function criarCard(titulo, texto) {

    return `
        <div class="card">
            <h2>${titulo}</h2>
            <p>${texto}</p>
        </div>
    `;

}


/******************************************************************
 
 * MOSTRA A TELA DE CURSOS
 Cria a função renderCursos, que recebe os dados do JSON como parâmetro
 Dentro da função, o conteúdo da div app é atualizado para mostar o novo HTML de Cursos, incluindo o número de acessos.

 * O QUE FAZ:

 ******************************************************************/
function renderCursos(dados) {

    app.innerHTML = `
        <h1>Cursos</h1>

        <p>
            Acessos: ${estado.acessos}
        </p>
    `;

    dados.cursos.forEach(curso => {

        app.innerHTML += criarCard(
            curso.nome,
            curso.modalidade
        );

    });

}
// é criada a função renderNoticias, que recebe os dados já convertidos em JavaScript do dados.json
// ela altera o HTML atual da div "app", substituindo tudo por uma nova tela
// essa nova tela contém o título e o contador de acessos
// depois, o forEach percorre a lista de notícias (ou cursos, dependendo da função)
// o forEach NÃO atribui valores em dados, ele apenas percorre a lista
// para cada item, ele usa a função criarCard
// que monta um HTML base (card) usando nome e modalidade (ou título e resumo)
// esse HTML é adicionado na tela com innerHTML +=
    
/******************************************************************
 *
 * MOSTRA A TELA DE NOTÍCIAS
 *
 * O QUE FAZ:
 * Exibe notícias vindas do JSON.
 *
 * POR QUE:
 * Demonstrar outra rota.
 *
 * COMO:
 * Percorrendo o array noticias.
 *
 ******************************************************************/
function renderNoticias(dados) {

    app.innerHTML = `
        <h1>Notícias</h1>

        <p>
            Acessos: ${estado.acessos}
        </p>
    `;

    dados.noticias.forEach(noticia => {

        app.innerHTML += criarCard(
            noticia.titulo,
            noticia.resumo
        );

    });

}


/******************************************************************
 *
 * RENDERIZA A TELA
 *
 * O QUE FAZ:
 * Decide qual conteúdo mostrar.
 *
 * POR QUE:
 * Centralizar a navegação da SPA.
 *
 * COMO:
 * Verificando a página atual.
 *
 ******************************************************************/
async function renderizar(pagina) {

    const dados = await carregarDados();

    // Atualiza estado
    estado.pagina = pagina;

    // Incrementa contador
    estado.acessos++;

    if (pagina === "cursos") {

        renderCursos(dados);

    }

    if (pagina === "noticias") {

        renderNoticias(dados);

    }

}


/******************************************************************
 *
 * HASH ROUTING
 *
 * O QUE FAZ:
 * Detecta mudança após o # da URL.
 *
 * POR QUE:
 * Permitir navegação sem recarregar a página.
 *
 * COMO:
 * Usando o evento hashchange.
 *
 ******************************************************************/
window.addEventListener("hashchange", () => {

    const rota =
        location.hash.replace("#", "");

    renderizar(rota);

});


/******************************************************************
 *
 * HISTORY API
 *
 * O QUE FAZ:
 * Altera URL sem recarregar.
 *
 * POR QUE:
 * Criar URLs mais bonitas.
 *
 * COMO:
 * Usando pushState().
 *
 ******************************************************************/
function navegarNoticias() {

    history.pushState(
        {},
        "",
        "/noticias"
    );

    renderizar("noticias");

}


/******************************************************************
 *
 * POPSTATE
 *
 * O QUE FAZ:
 * Detecta voltar e avançar do navegador.
 *
 * POR QUE:
 * Manter a SPA sincronizada.
 *
 * COMO:
 * Escutando o evento popstate.
 *
 ******************************************************************/
window.addEventListener("popstate", () => {

    renderizar("noticias");

});


/******************************************************************
 *
 * INICIALIZA A SPA
 *
 * O QUE FAZ:
 * Mostra a primeira tela.
 *
 * POR QUE:
 * A aplicação precisa iniciar em algum lugar.
 *
 * COMO:
 * Chamando renderizar.
 *
 ******************************************************************/
renderizar("cursos");