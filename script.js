let palavras = [
{
numero: 1,
palavra: "MICROCONTROLADOR",
direcao: "H",
linha: 1,
coluna: 0,
pista: "Chip completo com processador, memória e periféricos integrados para sistemas embarcados."
},
{
numero: 2,
palavra: "ROM",
direcao: "V",
linha: 0,
coluna: 3,
pista: "Memória não volátil que guarda instruções permanentes de inicialização."
},
{
numero: 3,
palavra: "REGISTRADORES",
direcao: "V",
linha: 1,
coluna: 8,
pista: "Memória interna ultrarrápida da CPU usada para guardar dados temporários."
},
{
numero: 4,
palavra: "ADDRESSBUS",
direcao: "V",
linha: 1,
coluna: 12,
pista: "Via unidirecional por onde o processador envia locais físicos de memória."
},
{
numero: 5,
palavra: "CACHE",
direcao: "H",
linha: 3,
coluna: 11,
pista: "Memória intermediária veloz entre o processador e a memória principal."
},
{
numero: 6,
palavra: "DATABUS",
direcao: "H",
linha: 5,
coluna: 7,
pista: "Via bidirecional que transporta informações entre processador, memória e periféricos."
},
{
numero: 7,
palavra: "ULA",
direcao: "V",
linha: 5,
coluna: 13,
pista: "Parte da CPU que faz as contas e as operações lógicas."
},
{
numero: 8,
palavra: "FLASH",
direcao: "H",
linha: 7,
coluna: 5,
pista: "Armazenamento não volátil regravável eletricamente em blocos, usado em pendrives."
},
{
numero: 9,
palavra: "CPU",
direcao: "V",
linha: 7,
coluna: 10,
pista: "Cérebro do computador responsável por buscar, decodificar e executar instruções."
},
{
numero: 10,
palavra: "RAM",
direcao: "H",
linha: 9,
coluna: 6,
pista: "Memória principal volátil de leitura e escrita que perde dados sem energia."
},
{
numero: 11,
palavra: "DMA",
direcao: "V",
linha: 9,
coluna: 8,
pista: "Recurso que permite periféricos acessarem a memória sem passar pelo processador."
},
{
numero: 12,
palavra: "DUALCORE",
direcao: "H",
linha: 11,
coluna: 8,
pista: "Processador que possui dois núcleos físicos independentes no mesmo chip."
},
{
numero: 13,
palavra: "QUADCORE",
direcao: "H",
linha: 13,
coluna: 1,
pista: "Processador equipado com quatro núcleos físicos para processamento paralelo."
}
];

let totalLinhas = 15;
let totalColunas = 16;
let direcaoAtual = "H";

function montarJogo() {
let grade = [];
for (let l = 0; l < totalLinhas; l++) {
grade[l] = [];
for (let c = 0; c < totalColunas; c++) {
grade[l][c] = null;
}
}

for (let i = 0; i < palavras.length; i++) {
let item = palavras[i];
for (let j = 0; j < item.palavra.length; j++) {
let l = item.linha;
let c = item.coluna;
if (item.direcao == "H") {
c = c + j;
} else {
l = l + j;
}

if (grade[l][c] == null) {
grade[l][c] = {
letra: item.palavra[j],
numero: j == 0 ? item.numero : "",
direcaoInicio: j == 0 ? item.direcao : ""
};
} else if (j == 0) {
grade[l][c].numero = item.numero;
grade[l][c].direcaoInicio = item.direcao;
}
}
}

let htmlTabuleiro = "";
for (let l = 0; l < totalLinhas; l++) {
for (let c = 0; c < totalColunas; c++) {
if (grade[l][c] == null) {
htmlTabuleiro += `<div class="celula-vazia"></div>`;
} else {
let numTexto = grade[l][c].numero != "" ? `<span class="numero-pista">${grade[l][c].numero}</span>` : "";
let dirInicio = grade[l][c].direcaoInicio;
htmlTabuleiro += `
<div class="celula-wrapper">
${numTexto}
<input type="text" maxlength="1" id="cel_${l}_${c}" class="celula-input" onfocus="definirDirecao('${dirInicio}')" oninput="aoDigitar(this, ${l}, ${c})" onkeydown="aoPressionarTecla(event, ${l}, ${c})">
</div>
`;
}
}
}
div_tabuleiro.innerHTML = htmlTabuleiro;

let htmlHorizontais = "";
let htmlVerticais = "";
for (let i = 0; i < palavras.length; i++) {
let item = palavras[i];
let linhaPista = `<li id="pista_${item.numero}" onclick="focarPalavra(${item.linha}, ${item.coluna}, '${item.direcao}')"><span class="clue-num">${item.numero}</span>${item.pista}</li>`;
if (item.direcao == "H") {
htmlHorizontais += linhaPista;
} else {
htmlVerticais += linhaPista;
}
}
lista_horizontais.innerHTML = htmlHorizontais;
lista_verticais.innerHTML = htmlVerticais;
}

function definirDirecao(dir) {
if (dir == "H" || dir == "V") {
direcaoAtual = dir;
}
}

function focarPalavra(l, c, dir) {
direcaoAtual = dir;
let campo = document.querySelector(`#cel_${l}_${c}`);
if (campo != null) {
campo.focus();
}
}

function aoDigitar(input, l, c) {
input.classList.remove("certa");
input.classList.remove("errada");

if (input.value.length == 1) {
let proxL = direcaoAtual == "V" ? l + 1 : l;
let proxC = direcaoAtual == "H" ? c + 1 : c;
let proximoCampo = document.querySelector(`#cel_${proxL}_${proxC}`);
if (proximoCampo != null) {
proximoCampo.focus();
}
}
}

function aoPressionarTecla(evento, l, c) {
let alvoL = l;
let alvoC = c;

if (evento.key == "ArrowRight") {
direcaoAtual = "H";
alvoC = c + 1;
} else if (evento.key == "ArrowLeft") {
direcaoAtual = "H";
alvoC = c - 1;
} else if (evento.key == "ArrowDown") {
direcaoAtual = "V";
alvoL = l + 1;
} else if (evento.key == "ArrowUp") {
direcaoAtual = "V";
alvoL = l - 1;
} else if (evento.key == "Backspace" && evento.target.value == "") {
if (direcaoAtual == "H") {
alvoC = c - 1;
} else {
alvoL = l - 1;
}
} else {
return;
}

let proximo = document.querySelector(`#cel_${alvoL}_${alvoC}`);
if (proximo != null) {
evento.preventDefault();
proximo.focus();
}
}

function conferir() {
let acertos = 0;
let inputs = document.querySelectorAll(".celula-input");
for (let i = 0; i < inputs.length; i++) {
inputs[i].classList.remove("certa");
inputs[i].classList.remove("errada");
}

for (let i = 0; i < palavras.length; i++) {
let item = palavras[i];
let palavraCorreta = true;

for (let j = 0; j < item.palavra.length; j++) {
let l = item.linha;
let c = item.coluna;
if (item.direcao == "H") {
c = c + j;
} else {
l = l + j;
}
let campo = document.querySelector(`#cel_${l}_${c}`);
let valorDigitado = campo.value.toUpperCase();
if (valorDigitado != item.palavra[j]) {
palavraCorreta = false;
}
}

let itemPista = document.querySelector(`#pista_${item.numero}`);
if (palavraCorreta) {
itemPista.classList.add("pista-resolvida");
} else {
itemPista.classList.remove("pista-resolvida");
}

for (let j = 0; j < item.palavra.length; j++) {
let l = item.linha;
let c = item.coluna;
if (item.direcao == "H") {
c = c + j;
} else {
l = l + j;
}
let campo = document.querySelector(`#cel_${l}_${c}`);
if (palavraCorreta) {
campo.classList.add("certa");
} else if (!campo.classList.contains("certa")) {
campo.classList.add("errada");
}
}

if (palavraCorreta) {
acertos++;
}
}

span_acertos.innerHTML = acertos;

if (acertos == palavras.length) {
span_status.innerHTML = "STATUS: ZONE CLEARED!";
div_vitoria.classList.remove("hidden");
} else {
span_status.innerHTML = `STATUS: ${acertos} DE ${palavras.length} ANÉIS COLETADOS`;
}
}

function fecharVitoria() {
div_vitoria.classList.add("hidden");
}

function reiniciar() {
let inputs = document.querySelectorAll(".celula-input");
for (let i = 0; i < inputs.length; i++) {
inputs[i].value = "";
inputs[i].classList.remove("certa");
inputs[i].classList.remove("errada");
}

for (let i = 0; i < palavras.length; i++) {
let itemPista = document.querySelector(`#pista_${palavras[i].numero}`);
itemPista.classList.remove("pista-resolvida");
}

span_acertos.innerHTML = "0";
span_status.innerHTML = "STATUS: PRONTO PARA O SPIN DASH!";
div_vitoria.classList.add("hidden");
}

montarJogo();