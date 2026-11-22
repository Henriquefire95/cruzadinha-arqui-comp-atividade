// Cada palavra: resposta, linha e coluna onde começa, direção (H ou V) e pista.
const palavras = [
  { resposta: "MICROCONTROLADOR", linha: 4, coluna: 0,  dir: "H", pista: "Chip único com CPU, memória e entradas e saídas, usado em eletrodomésticos e sistemas embarcados." },
  { resposta: "REGISTRADORES",    linha: 0, coluna: 2,  dir: "H", pista: "Pequenas memórias dentro da CPU, as mais rápidas, que guardam dados em uso imediato." },
  { resposta: "QUADCORE",         linha: 0, coluna: 20, dir: "H", pista: "Processador com quatro núcleos, capaz de executar quatro tarefas ao mesmo tempo." },
  { resposta: "MEMORIADEMASSA",   linha: 2, coluna: 6,  dir: "H", pista: "Guarda arquivos e programas de forma permanente, como HD ou SSD, com muita capacidade." },
  { resposta: "ADDRESSBUS",       linha: 5, coluna: 15, dir: "H", pista: "Via de mão única em que a CPU indica qual posição da memória quer acessar." },
  { resposta: "DUALCORE",         linha: 6, coluna: 1,  dir: "H", pista: "Processador com dois núcleos, capaz de executar duas tarefas ao mesmo tempo." },
  { resposta: "EEPROM",           linha: 6, coluna: 10, dir: "H", pista: "Memória não volátil regravável byte a byte, comum em microcontroladores para guardar configurações." },

  { resposta: "ROM",     linha: 0, coluna: 8,  dir: "V", pista: "Memória não volátil que guarda as instruções de inicialização do computador, mesmo sem energia." },
  { resposta: "ULA",     linha: 0, coluna: 16, dir: "V", pista: "Dentro da CPU, executa os cálculos e as comparações lógicas." },
  { resposta: "DATABUS", linha: 0, coluna: 23, dir: "V", pista: "Via de mão dupla que transporta as informações entre CPU, memória e dispositivos." },
  { resposta: "CACHE",   linha: 1, coluna: 19, dir: "V", pista: "Memória pequena e rápida entre CPU e RAM; guarda o que é mais usado." },
  { resposta: "FLASH",   linha: 2, coluna: 21, dir: "V", pista: "Memória não volátil regravável por blocos, usada em pen drives e cartões de memória." },
  { resposta: "DMA",     linha: 3, coluna: 0,  dir: "V", pista: "Controlador que move dados entre periféricos e RAM sem ocupar a CPU." },
  { resposta: "UC",      linha: 3, coluna: 5,  dir: "V", pista: "Dá as ordens para as outras peças do processador: busca e interpreta as instruções." },
  { resposta: "CPU",     linha: 4, coluna: 2,  dir: "V", pista: "Cérebro do computador; abriga a UC e a ULA e executa instruções." },
  { resposta: "RAM",     linha: 4, coluna: 15, dir: "V", pista: "Memória temporária que guarda programas e dados em uso e perde tudo ao desligar." }
];

const tabuleiroEl = document.getElementById("tabuleiro");
const contadorEl = document.getElementById("contador");
const pistasH = document.getElementById("pistas-h");
const pistasV = document.getElementById("pistas-v");

let celulas = {};   // "linha,coluna" -> { input, el, letra }

// Retorna as posições (linha, coluna) de cada letra de uma palavra.
function posicoes(p) {
  const lista = [];
  for (let i = 0; i < p.resposta.length; i++) {
    lista.push({
      linha: p.linha + (p.dir === "V" ? i : 0),
      coluna: p.coluna + (p.dir === "H" ? i : 0),
      letra: p.resposta[i]
    });
  }
  return lista;
}

// Numera as palavras: ordem de leitura (linha, depois coluna). Início igual = mesmo número.
function numerar() {
  const inicios = [];
  palavras.forEach(p => {
    const chave = p.linha + "," + p.coluna;
    if (!inicios.includes(chave)) inicios.push(chave);
  });
  inicios.sort((a, b) => {
    const [la, ca] = a.split(",").map(Number);
    const [lb, cb] = b.split(",").map(Number);
    return la - lb || ca - cb;
  });
  palavras.forEach(p => {
    p.numero = inicios.indexOf(p.linha + "," + p.coluna) + 1;
  });
}

function construirTabuleiro() {
  const totalLinhas = Math.max(...palavras.map(p => p.linha + (p.dir === "V" ? p.resposta.length : 1)));
  const totalColunas = Math.max(...palavras.map(p => p.coluna + (p.dir === "H" ? p.resposta.length : 1)));

  tabuleiroEl.style.gridTemplateColumns = `repeat(${totalColunas}, auto)`;
  tabuleiroEl.innerHTML = "";
  celulas = {};

  // descobre quais casas são usadas
  palavras.forEach(p => {
    posicoes(p).forEach(pos => {
      const chave = pos.linha + "," + pos.coluna;
      celulas[chave] = celulas[chave] || { linha: pos.linha, coluna: pos.coluna, letra: pos.letra };
    });
  });

  for (let l = 0; l < totalLinhas; l++) {
    for (let c = 0; c < totalColunas; c++) {
      const chave = l + "," + c;
      const el = document.createElement("div");
      el.className = "celula";
      el.setAttribute("role", "gridcell");

      if (!celulas[chave]) {
        el.classList.add("vazia");
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.autocomplete = "off";
        input.setAttribute("aria-label", `Linha ${l + 1}, coluna ${c + 1}`);
        input.dataset.linha = l;
        input.dataset.coluna = c;
        input.addEventListener("input", aoDigitar);
        input.addEventListener("keydown", aoTeclar);
        el.appendChild(input);

        const inicio = palavras.find(p => p.linha === l && p.coluna === c);
        if (inicio) {
          const num = document.createElement("span");
          num.className = "num";
          num.textContent = inicio.numero;
          el.appendChild(num);
        }

        celulas[chave].input = input;
        celulas[chave].el = el;
      }
      tabuleiroEl.appendChild(el);
    }
  }
}

function construirPistas() {
  pistasH.innerHTML = "";
  pistasV.innerHTML = "";
  const ordenadas = [...palavras].sort((a, b) => a.numero - b.numero);
  ordenadas.forEach(p => {
    const li = document.createElement("li");
    li.dataset.resposta = p.resposta;
    li.innerHTML = `<span class="n">${p.numero}</span>${p.pista}`;
    p.li = li;
    (p.dir === "H" ? pistasH : pistasV).appendChild(li);
  });
}

// Direção usada para avançar o cursor: a da última palavra tocada.
let direcaoAtual = "H";

function aoDigitar(e) {
  const input = e.target;
  input.value = input.value.replace(/[^a-zA-ZÀ-ÿ]/g, "").toUpperCase();
  limparEstado();
  if (input.value) irParaProxima(input, 1);
}

function aoTeclar(e) {
  const input = e.target;
  const l = Number(input.dataset.linha);
  const c = Number(input.dataset.coluna);
  const setas = { ArrowLeft: [0, -1, "H"], ArrowRight: [0, 1, "H"], ArrowUp: [-1, 0, "V"], ArrowDown: [1, 0, "V"] };

  if (setas[e.key]) {
    e.preventDefault();
    direcaoAtual = setas[e.key][2];
    focar(l + setas[e.key][0], c + setas[e.key][1]);
  } else if (e.key === "Backspace" && !input.value) {
    e.preventDefault();
    irParaProxima(input, -1);
  }
}

function focar(l, c) {
  const cel = celulas[l + "," + c];
  if (cel) { cel.input.focus(); cel.input.select(); }
}

function irParaProxima(input, passo) {
  const l = Number(input.dataset.linha);
  const c = Number(input.dataset.coluna);
  // escolhe a direção que existe nesta casa
  const temH = celulas[l + "," + (c + passo)];
  const temV = celulas[(l + passo) + "," + c];
  if (direcaoAtual === "H" && temH) focar(l, c + passo);
  else if (direcaoAtual === "V" && temV) focar(l + passo, c);
  else if (temH) { direcaoAtual = "H"; focar(l, c + passo); }
  else if (temV) { direcaoAtual = "V"; focar(l + passo, c); }
}

function limparEstado() {
  Object.values(celulas).forEach(cel => cel.el.classList.remove("certa", "errada"));
}

function conferir() {
  limparEstado();
  let acertos = 0;

  palavras.forEach(p => {
    const pos = posicoes(p);
    const certa = pos.every(x => celulas[x.linha + "," + x.coluna].input.value.toUpperCase() === x.letra);
    if (certa) acertos++;
    p.li.classList.toggle("feita", certa);
    // palavras erradas ficam vermelhas; as certas pintam por cima depois
    if (!certa) pos.forEach(x => celulas[x.linha + "," + x.coluna].el.classList.add("errada"));
  });

  // segunda passada: palavras certas ficam verdes (mesmo em casas compartilhadas)
  palavras.forEach(p => {
    const pos = posicoes(p);
    const certa = pos.every(x => celulas[x.linha + "," + x.coluna].input.value.toUpperCase() === x.letra);
    if (certa) pos.forEach(x => {
      const el = celulas[x.linha + "," + x.coluna].el;
      el.classList.remove("errada");
      el.classList.add("certa");
    });
  });

  contadorEl.textContent = `${acertos} de ${palavras.length} palavras corretas`;
  if (acertos === palavras.length) contadorEl.textContent += " – Parabéns, você completou!";
}

function reiniciar() {
  Object.values(celulas).forEach(cel => { cel.input.value = ""; });
  limparEstado();
  palavras.forEach(p => p.li.classList.remove("feita"));
  contadorEl.textContent = `0 de ${palavras.length} palavras corretas`;
  const primeira = Object.values(celulas)[0];
  if (primeira) primeira.input.focus();
}

document.getElementById("btn-conferir").addEventListener("click", conferir);
document.getElementById("btn-reiniciar").addEventListener("click", reiniciar);

numerar();
construirTabuleiro();
construirPistas();
