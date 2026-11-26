// ===== Jogo da Forca =====
// Disciplina: Front-End | Professor: Augusto Baia
// Aluno: Arthur Vitor Freitas Lopes | Matrícula: 04209464
// Curso: ADS | Instituição: UNAMA

// ---------- DADOS ----------

// ---------- BANCO DE PALAVRAS ----------
// Para adicionar uma palavra nova é só escrever ela na categoria que quiser.
// Regras: só letras (sem espaço e sem hífen), com acento se precisar.
// O tamanho da palavra define o nível: até 6 letras = fácil,
// 7 e 8 letras = médio, 9 ou mais = difícil.

const PALAVRAS = {
  'Tecnologia': [
    'robô', 'drone', 'nuvem', 'chip', 'rede', 'laser', 'pixel', 'sensor', 'tablet',
    'satélite', 'internet', 'celular', 'inovação', 'virtual', 'automação',
    'bluetooth', 'algoritmo', 'blockchain', 'criptografia', 'computação',
    'tecnologia', 'smartphone', 'holograma', 'inteligência'
  ],
  'Programação': [
    'código', 'função', 'laço', 'array', 'classe', 'loop', 'bug', 'string', 'objeto', 'método',
    'variável', 'herança', 'condição', 'booleano', 'servidor',
    'framework', 'constante', 'interface', 'parâmetro', 'compilador', 'depuração',
    'recursividade', 'programação', 'polimorfismo', 'encapsulamento', 'javascript'
  ],
  'Informática': [
    'mouse', 'placa', 'cabo', 'tela', 'pasta', 'tecla', 'disco', 'backup', 'senha', 'webcam',
    'arquivo', 'teclado', 'monitor', 'memória', 'firewall', 'roteador', 'software', 'hardware',
    'pendrive', 'notebook', 'download',
    'navegador', 'antivírus', 'processador', 'impressora', 'computador', 'armazenamento'
  ],
  'Jogos': [
    'fase', 'mapa', 'dado', 'xadrez', 'chefão', 'nível', 'vida', 'moeda', 'damas', 'missão',
    'baralho', 'console', 'tesouro', 'vitória', 'jogador', 'joystick', 'controle', 'aventura',
    'tabuleiro', 'pontuação', 'armadilha', 'personagem', 'campeonato', 'checkpoint',
    'estratégia', 'multijogador'
  ],
  'Conhecimentos gerais': [
    'rio', 'ilha', 'mundo', 'terra', 'oceano', 'vulcão', 'música', 'cultura', 'ciência', 'eclipse',
    'planeta', 'universo', 'história', 'floresta', 'Amazônia', 'Santarém', 'oxigênio',
    'girassol', 'gravidade', 'relâmpago', 'biblioteca', 'democracia', 'continente',
    'geografia', 'literatura', 'astronomia', 'civilização'
  ],
  'Animais': [
    'gato', 'cão', 'vaca', 'zebra', 'tigre', 'cobra', 'cavalo', 'macaco', 'girafa', 'jacaré', 'coelho',
    'pinguim', 'canguru', 'tubarão', 'elefante', 'golfinho', 'papagaio', 'leopardo',
    'tartaruga', 'crocodilo', 'chimpanzé', 'borboleta', 'escorpião', 'hipopótamo',
    'rinoceronte', 'ornitorrinco'
  ],
  'Frutas': [
    'uva', 'pera', 'manga', 'limão', 'caju', 'mamão', 'goiaba', 'banana', 'kiwi', 'figo', 'lima', 'açaí',
    'laranja', 'abacaxi', 'morango', 'abacate', 'melancia', 'maracujá', 'graviola', 'pitanga',
    'cupuaçu', 'acerola', 'mexerica',
    'jabuticaba', 'tangerina', 'framboesa', 'carambola', 'tamarindo', 'bergamota'
  ],
  'Países': [
    'Brasil', 'Chile', 'Peru', 'Japão', 'Itália', 'Cuba', 'China', 'Índia', 'Egito', 'Rússia', 'Suíça',
    'Canadá', 'México', 'Uruguai', 'Espanha', 'Portugal', 'Colômbia', 'Paraguai', 'Alemanha',
    'Argentina', 'Venezuela', 'Inglaterra', 'Austrália', 'Moçambique', 'Dinamarca', 'Finlândia'
  ],
  'Profissões': [
    'médico', 'pintor', 'piloto', 'cantor', 'garçom', 'juiz', 'chef',
    'padeiro', 'dentista', 'bombeiro', 'advogado', 'mecânico', 'policial', 'pedreiro',
    'professor', 'motorista', 'cozinheiro', 'enfermeiro', 'engenheiro', 'jornalista',
    'programador', 'arquiteto', 'veterinário', 'farmacêutico', 'eletricista', 'carpinteiro'
  ]
};

// cada nível muda o tamanho das palavras, as tentativas e os pontos
const NIVEIS = {
  facil:   { nome: 'Fácil',   tentativas: 10, multiplicador: 1, min: 1,  max: 6 },
  medio:   { nome: 'Médio',   tentativas: 8,  multiplicador: 2, min: 7,  max: 8 },
  dificil: { nome: 'Difícil', tentativas: 6,  multiplicador: 3, min: 9,  max: 30 }
};

const MENSAGENS = {
  acerto: ['Boa! Continue assim!', 'Mandou bem!', 'Você está indo bem!', 'Essa letra estava lá!'],
  erro: ['Ops, tente outra letra.', 'Não foi dessa vez...', 'Calma, pense com atenção.', 'Quase! Tente de novo.'],
  perigo: ['Cuidado, poucas tentativas!', 'Está ficando perigoso...', 'Não desista agora!']
};

const TOTAL_PARTES = 10; // partes do desenho da forca

// ---------- VARIÁVEIS DO JOGO ----------

let placar = carregarPlacar();
let somLigado = localStorage.getItem('forca_som') !== 'off';
let nivelAtual = 'medio';
let categoriaAtual = 'todas';
let jogo = null;          // dados da rodada atual
let palavrasUsadas = [];  // para não repetir palavra na mesma sessão
let audioCtx = null;

const $ = (id) => document.getElementById(id);

// ---------- FUNÇÕES AUXILIARES ----------

// tira os acentos e deixa maiúsculo (ex: "ã" vira "A")
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

function sortear(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach((t) => t.classList.toggle('ativa', t.id === id));
}

// ---------- LOCALSTORAGE ----------

function carregarPlacar() {
  const padrao = { pontos: 0, vitorias: 0, derrotas: 0, recorde: 0 };
  try {
    const salvo = JSON.parse(localStorage.getItem('forca_placar'));
    return salvo ? { ...padrao, ...salvo } : padrao;
  } catch (erro) {
    return padrao;
  }
}

function salvarPlacar() {
  localStorage.setItem('forca_placar', JSON.stringify(placar));
}

function atualizarPlacar() {
  $('pontos').textContent = placar.pontos;
  $('vitorias').textContent = placar.vitorias;
  $('derrotas').textContent = placar.derrotas;
  $('recorde').textContent = placar.recorde;
}

// ---------- SONS (Web Audio API) ----------

function tocarNota(freq, inicio, duracao, tipo = 'sine') {
  const osc = audioCtx.createOscillator();
  const ganho = audioCtx.createGain();
  const t = audioCtx.currentTime + inicio;
  osc.type = tipo;
  osc.frequency.value = freq;
  ganho.gain.setValueAtTime(0.15, t);
  ganho.gain.exponentialRampToValueAtTime(0.001, t + duracao);
  osc.connect(ganho);
  ganho.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + duracao);
}

function tocarSom(tipo) {
  if (!somLigado) return;
  const sons = {
    acerto:  [[660, 0, 0.12]],
    erro:    [[180, 0, 0.25, 'sawtooth']],
    vitoria: [[523, 0, 0.15], [659, 0.15, 0.15], [784, 0.3, 0.35]],
    derrota: [[300, 0, 0.2, 'triangle'], [220, 0.2, 0.2, 'triangle'], [150, 0.4, 0.4, 'triangle']]
  };
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sons[tipo].forEach((nota) => tocarNota(...nota));
  } catch (erro) {
    // se o navegador não deixar tocar, o jogo continua normal
  }
}

function atualizarBotaoSom() {
  $('btn-som').textContent = somLigado ? '🔊 Som: ligado' : '🔇 Som: desligado';
}

// ---------- TECLADO VIRTUAL ----------

function criarTeclado() {
  const teclado = $('teclado');
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((letra) => {
    const botao = document.createElement('button');
    botao.className = 'tecla';
    botao.textContent = letra;
    botao.dataset.letra = letra;
    botao.addEventListener('click', () => escolherLetra(letra));
    teclado.appendChild(botao);
  });
}

function resetarTeclado() {
  document.querySelectorAll('.tecla').forEach((t) => {
    t.disabled = false;
    t.classList.remove('certa', 'errada');
  });
}

// ---------- RODADA ----------

function iniciarRodada() {
  const nivel = NIVEIS[nivelAtual];
  const categorias = categoriaAtual === 'todas' ? Object.keys(PALAVRAS) : [categoriaAtual];

  // junta as palavras que servem para o nível escolhido
  const opcoes = [];
  categorias.forEach((cat) => {
    PALAVRAS[cat].forEach((p) => {
      const tamanho = normalizar(p).length;
      if (tamanho >= nivel.min && tamanho <= nivel.max && !palavrasUsadas.includes(p)) {
        opcoes.push({ palavra: p, categoria: cat });
      }
    });
  });

  // se todas já saíram, começa a lista de novo
  if (opcoes.length === 0) {
    palavrasUsadas = [];
    return iniciarRodada();
  }

  const sorteada = sortear(opcoes);
  jogo = {
    palavra: sorteada.palavra,
    categoria: sorteada.categoria,
    semAcento: normalizar(sorteada.palavra),
    certas: [],
    erradas: [],
    max: nivel.tentativas,
    fim: false
  };

  $('categoria').textContent = jogo.categoria;
  $('nivel').textContent = nivel.nome;
  $('palavra').classList.remove('vitoria');
  $('modal').classList.remove('aberto');
  $('mensagem').textContent = 'Boa sorte! Escolha uma letra.';

  resetarTeclado();
  desenharPalavra(false, '');
  desenharForca();
  atualizarInfo();
}

function desenharPalavra(revelar, novaLetra) {
  const area = $('palavra');
  area.innerHTML = '';
  [...jogo.palavra].forEach((caractere) => {
    const span = document.createElement('span');
    span.className = 'letra';
    const base = normalizar(caractere);
    const acertou = jogo.certas.includes(base);
    if (acertou || revelar) {
      span.textContent = caractere.toUpperCase();
      if (!acertou) span.classList.add('revelada');
      if (base === novaLetra) span.classList.add('pop');
    }
    area.appendChild(span);
  });
}

// mostra as partes do desenho de acordo com a quantidade de erros
function desenharForca() {
  const partes = document.querySelectorAll('.parte');
  const quantas = Math.round((jogo.erradas.length * TOTAL_PARTES) / jogo.max);
  partes.forEach((parte, i) => parte.classList.toggle('visivel', i < quantas));
}

function atualizarInfo() {
  $('tentativas').textContent = jogo.max - jogo.erradas.length;
  $('erradas').textContent = jogo.erradas.length ? jogo.erradas.join(' ') : '-';
}

function mensagem(texto) {
  $('mensagem').textContent = texto;
}

function escolherLetra(letra) {
  if (!jogo || jogo.fim) return;
  if (jogo.certas.includes(letra) || jogo.erradas.includes(letra)) return; // letra repetida

  const tecla = document.querySelector(`.tecla[data-letra="${letra}"]`);
  tecla.disabled = true;

  if (jogo.semAcento.includes(letra)) {
    // acertou
    jogo.certas.push(letra);
    tecla.classList.add('certa');
    tocarSom('acerto');
    mensagem(sortear(MENSAGENS.acerto));
    desenharPalavra(false, letra);

    const completa = [...jogo.semAcento].every((c) => jogo.certas.includes(c));
    if (completa) terminar(true);
  } else {
    // errou
    jogo.erradas.push(letra);
    tecla.classList.add('errada');
    tocarSom('erro');
    desenharForca();
    atualizarInfo();

    // reinicia a animação de tremer
    const svg = $('forca');
    svg.classList.remove('tremer');
    void svg.getBoundingClientRect();
    svg.classList.add('tremer');

    const restantes = jogo.max - jogo.erradas.length;
    if (restantes === 0) {
      terminar(false);
    } else {
      mensagem(restantes <= 2 ? sortear(MENSAGENS.perigo) : sortear(MENSAGENS.erro));
    }
  }
}

// ---------- FIM DA PARTIDA ----------

function terminar(venceu) {
  jogo.fim = true;
  palavrasUsadas.push(jogo.palavra);
  document.querySelectorAll('.tecla').forEach((t) => (t.disabled = true));

  const restantes = jogo.max - jogo.erradas.length;
  let ganhos = 0;

  if (venceu) {
    ganhos = (10 + restantes * 2) * NIVEIS[nivelAtual].multiplicador;
    placar.pontos += ganhos;
    placar.vitorias++;
    if (placar.pontos > placar.recorde) placar.recorde = placar.pontos;
    $('palavra').classList.add('vitoria');
    tocarSom('vitoria');
  } else {
    placar.derrotas++;
    desenharPalavra(true, ''); // mostra a palavra certa
    tocarSom('derrota');
  }

  salvarPlacar();
  atualizarPlacar();
  setTimeout(() => mostrarModal(venceu, ganhos), 1000);
}

function mostrarModal(venceu, ganhos) {
  const caixa = document.querySelector('.modal-caixa');
  caixa.classList.toggle('ganhou', venceu);
  caixa.classList.toggle('perdeu', !venceu);

  $('modal-titulo').textContent = venceu ? '🎉 Você venceu!' : '💀 Você perdeu!';
  $('modal-texto').textContent = venceu ? 'Parabéns, você descobriu a palavra!' : 'As tentativas acabaram. A palavra era:';
  $('modal-palavra').textContent = jogo.palavra.toUpperCase();
  $('modal-pontos').textContent = venceu
    ? `+${ganhos} pontos (total: ${placar.pontos})`
    : `Pontuação atual: ${placar.pontos}`;
  $('modal').classList.add('aberto');
}

function voltarAoMenu() {
  $('modal').classList.remove('aberto');
  mostrarTela('tela-inicio');
}

// ---------- EVENTOS ----------

// escolha de dificuldade
document.querySelectorAll('.nivel').forEach((botao) => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.nivel').forEach((b) => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    nivelAtual = botao.dataset.nivel;
  });
});

$('select-categoria').addEventListener('change', (e) => {
  categoriaAtual = e.target.value;
});

$('btn-iniciar').addEventListener('click', () => {
  mostrarTela('tela-jogo');
  iniciarRodada();
});

$('btn-novamente').addEventListener('click', iniciarRodada);
$('btn-voltar').addEventListener('click', voltarAoMenu);
$('btn-menu').addEventListener('click', voltarAoMenu);

$('btn-som').addEventListener('click', () => {
  somLigado = !somLigado;
  localStorage.setItem('forca_som', somLigado ? 'on' : 'off');
  atualizarBotaoSom();
});

$('btn-zerar').addEventListener('click', () => {
  if (confirm('Deseja realmente zerar pontos, vitórias, derrotas e recorde?')) {
    placar = { pontos: 0, vitorias: 0, derrotas: 0, recorde: 0 };
    salvarPlacar();
    atualizarPlacar();
  }
});

// regras do jogo (janela)
function abrirRegras() {
  $('modal-regras').classList.add('aberto');
}

function fecharRegras() {
  $('modal-regras').classList.remove('aberto');
}

$('btn-regras').addEventListener('click', abrirRegras);
$('btn-regras-jogo').addEventListener('click', abrirRegras);
$('btn-fechar-regras').addEventListener('click', fecharRegras);

// clicar fora da caixa ou apertar Esc também fecha
$('modal-regras').addEventListener('click', (e) => {
  if (e.target.id === 'modal-regras') fecharRegras();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharRegras();
});

// teclado físico
document.addEventListener('keydown', (e) => {
  if (!$('tela-jogo').classList.contains('ativa')) return;
  if ($('modal').classList.contains('aberto')) return;
  if ($('modal-regras').classList.contains('aberto')) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const letra = normalizar(e.key); // "ç" vira "C", "Enter" vira "ENTER" (ignorado)
  if (/^[A-Z]$/.test(letra)) escolherLetra(letra);
});

// ---------- INÍCIO ----------

criarTeclado();
atualizarPlacar();
atualizarBotaoSom();
