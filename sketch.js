// Variáveis para as raquetes, bola e barras horizontais
let raqueteJogador, raqueteComputador, bola, barraSuperior, barraInferior;

// Variáveis para pontuação e vidas
let jogadorNome = "";
let jogadorPontuacao = 0;
let cpuPontuacao = 0;
let vidasJogador = 10;
let vidasCPU = 10;


// Variável para controlar se o jogo está rodando
let jogoRodando = false;
let fundoImg, raqueteJogadorImg, raqueteComputadorImg, bolaImg;

// Variaveis para os sons
let context;
let bounceSound;
let golSound;
let lifeLostSound;
let backgroundSound;

function iniciarAudio() {
  // Inicia o contexto de áudio após uma ação do usuário
  context = getAudioContext();
}

function preload() {
  fundoImg = loadImage('imagens/fundo_pong.jpg');
  raqueteJogadorImg = loadImage('imagens/barra01.png');
  raqueteComputadorImg = loadImage('imagens/barra02.png');
  bolaImg = loadImage('imagens/bola.png');
  bounceSound = loadSound('sound/bounce.wav');
  golSound = loadSound('sound/goal.mp3');
  lifeLostSound = loadSound('sound/life_lost.wav');
  backgroundSound = loadSound('sound/background _sound.wav');
}

function setup() {
  createCanvas(800, 400);
  // Configurar o volume suave para o som de fundo
  backgroundSound.setVolume(0.5); // Volume ajustado para 50% do volume máximo
  // Reproduzir o som de fundo em loop
  backgroundSound.loop();
}

function draw() {
  if (!jogoRodando) {
    return;
  }
  
  image(fundoImg, 0, 0, width, height);

  // Desenhar raquetes, bola e barras horizontais com as imagens carregadas.
  image(raqueteJogadorImg, raqueteJogador.x, raqueteJogador.y, raqueteJogador.w / 2, raqueteJogador.h / 2);
  image(raqueteComputadorImg, raqueteComputador.x, raqueteComputador.y, raqueteComputador.w / 2, raqueteComputador.h / 2);

  // Exibir placar e vidas
  textSize(20);
  fill(255);
  text(jogadorNome + ": " + jogadorPontuacao, 20, 30);

  function gameOver() {
    backgroundSound.stop();
  }

  // Verificar se o jogador perdeu
  if (vidasJogador <= 0) {
    jogoRodando = false;
    textAlign(CENTER); // Centralizar o texto horizontalmente
    fill(255); // Definir a cor do texto como branco
    textSize(30); // Definir o tamanho da fonte
    text("Você Perdeu!   " + jogadorNome, width / 2 + 2 , height / 2 - 60 + 2);
    textLeading(60); // Espaçamento entre as linhas de texto
    textSize(30); // Definir o tamanho da fonte para o texto da pontuação
    text("Pontuação: " + jogadorPontuacao, width / 2 , height / 2 - 10);
    gameOver(); // Chamada da função gameOver() quando o jogador perdeu
  } else {
    text("Vidas: " + vidasJogador, 20, height - 20);
  }

  // Verificar se o jogo está rodando
  if (jogoRodando) {
    // Atualizar as posições das raquetes, bola e barras horizontais
    raqueteJogador.atualizar();
    raqueteComputador.atualizar();
    bola.atualizar(barraSuperior, barraInferior);

    // Verificar colisões entre bola e raquetes
    bola.verificarColisaoRaquete(raqueteJogador);
    bola.verificarColisaoRaquete(raqueteComputador);

    // Verificar se a bola atingiu as bordas laterais
    if (bola.atingiuBorda()) {
      // Verificar se o jogador ou CPU perdeu uma vida
      if (bola.x <= 0) {
        vidasJogador--;
        reiniciarRodada();
        lifeLostSound.play();
      } else if (bola.x >= width) {
        vidasCPU--;
        reiniciarRodada();
        jogadorPontuacao += 2;
        golSound.play(); // Incrementa a pontuação do jogador em 2 pontos
      }
    }
  }

  // Desenhar raquetes, bola e barras horizontais
  raqueteJogador.exibir();
  raqueteComputador.exibir();
  bola.exibir();
  barraSuperior.exibir();
  barraInferior.exibir();
}

// Função para iniciar o jogo
function startGame() {
  // Obtém o nome do jogador do campo de entrada
  jogadorNome = document.getElementById("playerName").value;

  // Esconde a área de entrada e o botão de início do jogo
  document.getElementById("gameArea").style.display = "none";

  // Inicialização das raquetes, bola e barras horizontais
  raqueteJogador = new Raquete(30, height / 2, 10, 60);
  raqueteComputador = new Raquete(width - 40, height / 2, 10, 60);
  bola = new Bola(10);
  barraSuperior = new Barra(0, 0, width, 5);
  barraInferior = new Barra(0, height, width, 5);

  jogoRodando = true;
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  jogadorPontuacao = 0;
  cpuPontuacao = 0;
  vidasJogador = 10;
  vidasCPU = 10;
  jogoRodando = true;
}

// Função para reiniciar a rodada
function reiniciarRodada() {
  // Reiniciar a posição da bola
  bola.reiniciar();
}

// Classe Raquete
class Raquete {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  atualizar() {
    // Atualizar posição da raquete do jogador com o movimento do mouse
    if (this === raqueteJogador) {
      this.y = mouseY;
    } else {
      // Movimento da raquete do computador em direção à bola
      if (bola.y > this.y + this.h / 2) {
        this.y += 3;
      } else if (bola.y < this.y - this.h / 2) {
        this.y -= 3;
      }
    }
    // Limitar a posição da raquete dentro da tela
    this.y = constrain(this.y, this.h / 2 + barraSuperior.h, height - this.h / 2 - barraInferior.h);
  }

  exibir() {
    let img;
    if (this === raqueteJogador) {
      img = raqueteJogadorImg;
    } else {
      img = raqueteComputadorImg;
    }
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    scale(this.h / 400.0); // Escala as imagens para metade do tamanho
    image(img, 0, 0, img.width, img.height);
    pop();
  }
}

// Classe Bola
class Bola {
  constructor(r) {
    this.r = r;
    this.reiniciar();
    this.colisoesRaqueteJogador = 0; // Contagem de colisões com a raquete do jogador
  }

  // Método para reiniciar a posição da bola
  reiniciar() {
    this.x = width / 2;
    this.y = height / 2;
    this.velocidadeX = random([-4, -3, 3, 4]);
    this.velocidadeY = random(-3, 3);
    this.anguloRotacao = 0;
  }

  // Método para atualizar a posição da bola e verificar colisões com as bordas
  atualizar(barraSuperior, barraInferior) {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;
    this.anguloRotacao += Math.atan2(this.velocidadeY, this.velocidadeX);

    // Verificar colisões com as bordas
    if (
      this.y - this.r / 2 <= barraSuperior.y + barraSuperior.h ||
      this.y + this.r / 2 >= barraInferior.y - barraInferior.h
    ) {
      this.velocidadeY *= -1;
    }
  }

  // Método para verificar colisão da bola com uma raquete
  verificarColisaoRaquete(raquete) {
    if (
      this.x + this.r / 2 >= raquete.x - raquete.w / 2 &&
      this.x - this.r / 2 <= raquete.x + raquete.w / 2 &&
      this.y + this.r / 2 >= raquete.y - raquete.h / 2 &&
      this.y - this.r / 2 <= raquete.y + raquete.h / 2
    ) {

      tocarSomColisao();

      // Inverte a direção horizontal da bola
      this.velocidadeX *= -1;

      // Incrementa a pontuação correspondente
      if (raquete === raqueteJogador) {
        jogadorPontuacao++;
        this.colisoesRaqueteJogador++; // Incrementa a contagem de colisões com a raquete do jogador

        // Verifica se a contagem atingiu um múltiplo de 3
        if (this.colisoesRaqueteJogador % 3 === 0) {
          // Aumenta a velocidade da bola
          this.velocidadeX *= 2.5;
          this.velocidadeY *= 2.5;
        }
      } else {
        cpuPontuacao++;
      }
    }
  }

  // Método para verificar se a bola atingiu as bordas laterais
  atingiuBorda() {
    if (this.x - this.r / 2 <= 0 || this.x + this.r / 2 >= width) {
      return true;
    }
    return false;
  }

  // Método para desenhar a bola
  exibir() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.anguloRotacao); // Adicione esta linha para aplicar a rotação
    scale(2 * this.r / 318); // Escala as imagens para que o diâmetro seja proporcional ao tamanho original
    image(bolaImg, 0, 0, bolaImg.width, bolaImg.height);
    pop();
  }
}

// Classe Barra
class Barra {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  // Método para desenhar a barra
  exibir() {
    fill(color("#2B3FD6"));
    rectMode(CENTER);
    rect(this.x + this.w / 2, this.y, this.w, this.h);
  }
}

function tocarSomColisao() {
  bounceSound.play();
}

function tocarSomDeGol() {
  golSound.play
}