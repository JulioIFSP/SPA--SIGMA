const app = document.getElementById("app")
//procura o id app no html e da esse valor para constante app*/
//Sem essa linha, o JavaScript não sabe qual elemento do HTML ele deve alterar.*/

/* ====================
   ESTADO DA APLICAÇÃO - Memória viva da aplicação. Valores mudam conforme o usuário interage.
==================== */



let estado = {
    paginaAtual: "home",
    acessos: 0,
    tema: "claro",
    noticias: []
}


/* ====================
   PÁGINAS - Guarda o HTML das paginas
==================== */

const paginas = {

    home: `
        <h2>Home</h2>
        <p>Bem-vindo à SPA.</p>

        <button id="btnAcessos">
            Mostrar acessos
        </button>

        <div id="resultado"></div>
    `,

    sobre: `
        <h2>Sobre</h2>
        <p>Projeto para estudar SPA.</p>
    `,

    contato: `
        <h2>Contato</h2>
        <p>Email: aluno@ifsp.edu.br</p>
    `,

    estado: `
        <h2>Estado da Aplicação</h2>

        <p>Página Atual:
            ${estado.paginaAtual}
        </p>

        <p>Acessos:
            ${estado.acessos}
        </p>

        <button id="trocarTema">
            Alternar Tema
        </button>
    `   
}

/* ====================
   RENDERIZAÇÃO
==================== */

function render(rota){

    estado.paginaAtual = rota //atualiza o estado para a pagina clicada
    estado.acessos++ // +1 acesso

    if(rota === "noticias"){
    renderNoticias()  // chama a função específica de notícias
    return            // para aqui, não continua
    }

    app.innerHTML =
        paginas[rota] //rota tem um valor de acordo com oq o usuario clicou 
        || //PLANO B - se a rota não existir mostra a mensagem erro
        "<h2>Página não encontrada</h2>"

    configurarEventos()
}

/* ====================
   EVENTOS DOM
==================== */

function configurarEventos(){

    let btn = document.getElementById("btnAcessos")

    if(btn){ //verifica se o botao existe na tela

        btn.onclick = () => { //se btn exister, quando for clicado procura o html resultado
                              //e da o valor acessos: quantidade pra ele

            document
                .getElementById("resultado")
                .innerHTML =
                `Acessos: ${estado.acessos}`
        }
    }

    let tema = document.getElementById("trocarTema")
// Busca trocarTema no HTML e guarda em tema.
// Se existir, quando clicado alterna o fundo e a cor do texto entre claro e escuro.
    if(tema){

        tema.onclick = () => {

            if(document.body.style.background == "black"){

                document.body.style.background = "#f4f4f4"
                document.body.style.color = "black"

            }else{

                document.body.style.background = "black"
                document.body.style.color = "white"

            }
        }
    }
}

/* ====================
   NOTÍCIAS JSON
==================== */

async function carregarNoticias(){ //Cria uma função assíncrona pode pausar e esperar sem travar o resto da página.

    const resposta =
        await fetch("dados.json")
//Busca o arquivo dados.json e pausa até receber a resposta. Guarda o resultado em resposta.
    const dados =
        await resposta.json()
//converte a resposta pra json e da esse valor para a const dados
   
    estado.noticias =
        dados.noticias
//pega o array (lista) noticias e atualiza o estado.noticias que estava vazio
}

function renderNoticias(){

    let html =
        "<h2>Notícias</h2>" //Cria a variável html com o título da página.

        //adiciona + html sem apagar oq ja tinha ESTRUTRA DA PAGINA
    html += ` 
        <button id="mostrar"> 
            Mostrar/Ocultar
        </button>

        <div id="lista">
    `

  estado.noticias.forEach(noticia => { 
//percorre cada noticia do array estado.noticias
// noticia => atribui esse html para cada noticia percorrida

    html += `
        <div class="card">
            <h3>${noticia.titulo}</h3>
            <p>${noticia.texto}</p>
            <button class="remover">Remover</button>
        </div>
    `
})

html += "</div>"

app.innerHTML = html //atualiza o html

    document
        .querySelectorAll(".remover") 
        //Busca todos os botões com a classe remover na tela que foram gerado pelas noticias.
    
        .forEach(botao => {
//Para cada botão encontrado, adiciona um evento de clique que remove o card pai quando clicado.
// apaga a div do card toda da qual o button faz parte
            botao.onclick = () => {

                botao
                    .parentElement
                    .remove()
            }
        })

    document
        .getElementById("mostrar")
        .onclick = () => {
//procura o mostrar que foi gerado junto com a pagina noticia e da um valor no clique dele
            document
                .getElementById("lista")
                .classList //O .classList acessa as classes CSS desse elemento 
                           // para adicionar ou remover o oculto.
                .toggle("oculto")
        }
}

/* ====================
   HASH ROUTING
==================== */

function rotaHash(){

    const rota =
        location.hash //pega oq vem depois do # na URL do site
        .replace("#","") //remove o # deixando só o nome
        || "home" //Se nao tiver # volta pra pagina padrao

    render(rota) //chama função render que atualiza o html de acordo com a pagina clicada.
}

window.addEventListener( //no objeto window (navegador) adiciona um evento escutador
    "hashchange", //o evento dispara quando o URL mudar
    rotaHash //Quando os requisitos desse evento forem cumpridos o rotaHash acontece
)

/* ====================
   HISTORY API
==================== */

function navegar(url){

    history.pushState( //muda a URL do navegador sem recarregar a página
        {},
        "",
        url
    )

    const rota =
        url.replace("/","") //remove a / da url deixando só o nome da rota

    render(rota) //chama o render com a rota limpa para atualizar a tela
}

document.addEventListener( //escuta todos os cliques da página
    "click",
    e => {

        if(
            e.target.matches("[data-link]") //verifica se o elemento clicado tem o atributo data-link
        ){

            e.preventDefault() //impede o comportamento padrão do link (recarregar a página)

            navegar(
                e.target.getAttribute("href") //pega o href do link clicado e passa para navegar()
            )
        }
    }
)

window.addEventListener(
    "popstate", //dispara quando o usuário clica em voltar/avançar no navegador
    () => {

        const rota =
            location.pathname //pega o caminho atual da URL
            .replace("/","") //remove a / deixando só o nome da rota
            || "home" //se não tiver rota, usa home como padrão

        render(rota) //atualiza a tela com a rota encontrada
    }
)

/* ====================
   INICIALIZAÇÃO
==================== */

async function iniciar(){ //função assíncrona que inicia a aplicação

    await carregarNoticias() //espera carregar as notícias antes de continuar

    if(location.hash){ //se a URL tiver # usa o hash routing

        rotaHash()

    }else{ //se não, usa a URL normal

        const rota =
            location.pathname
            .replace("/","") //remove a / deixando só o nome da rota
            || "home" //se não tiver rota, usa home como padrão

        render(rota) //atualiza a tela com a rota encontrada
    }
}
    
iniciar() //chama a função para iniciar a aplicação