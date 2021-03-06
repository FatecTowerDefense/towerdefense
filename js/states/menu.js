var menuMusic = null;
var menu_state = {
  create: function () {
    if (menuMusic === null) {
      menuMusic = this.add.audio('menu');
    }
    if (!menuMusic.isPlaying) {
      menuMusic.play('', 0, 1, true);
    }
    // Adiciona o botao de iniciar
    this.add.sprite(0, 0, 'menuPrincipal');
    this.logo = this.add.sprite(10, 50, 'logo');
    this.logo.scale.set(0.3);
    this.setStartButton();
    this.setCreditButton();
    this.setMuteButton();
    this.setVolumeButton();
  },

  // Vai para o estado de 'start' iniciando o jogo
  start: function () {
    menuMusic.stop();
    this.game.state.start('play');
  },

  // Vai para o estado de 'credit'
  credit: function () {
    this.game.state.start('credit');
  },
  
  // Controlador de mute
  mute: function () {
    // altera volume de mute para audio normal
    this.game.sound.mute = !this.game.sound.mute;
  },

  update: function () {
    // Ha algum problema com a posicao em relacao ao mundo quando retorna ao estado de menu
    // Vou deixar fixo perto para ter menu por enquanto
    this.startButton.x = 300;
    this.startButton.y = 400;

    this.creditButton.x = 230;
    this.creditButton.y = 550;
    
    this.muteButton.x = 370;
    this.muteButton.y = 550;
    
    this.volumeButton.x = 370;
    this.volumeButton.y = 550;
    
    if (this.game.sound.mute === false) {
      this.muteButton.x = 1370;
    } else {
      this.volumeButton.x = 1370;
    }
  },

  setStartButton: function () {
    // Define variaveis de posicao
    var x = this.game.world.width / 2 - 20;
    var y = this.game.world.height / 2;
    // Adiciona o botao de iniciar
    this.startButton = this.game.add.button(x, y, 'play', this.start, this, 1, 0, 1);
    this.startButton.scale.set(1);
    this.startButton.anchor.setTo(0.5, 0.5);
    this.startButton.inputEnabled = true;
    this.startButton.input.useHandCursor = true;
  },

  setCreditButton: function () {
    // Define variaveis de posicao
    var x = 20;
    var y = 550;
    // Adiciona o botao de iniciar
    this.creditButton = this.game.add.button(x, y, 'credit', this.credit, this, 1, 0, 1);
    this.creditButton.scale.set(1);
    this.creditButton.anchor.setTo(0.5, 0.5);
    this.creditButton.inputEnabled = true;
    this.creditButton.input.useHandCursor = true;
  },
  
  setVolumeButton: function () {
    // Define variaveis de posicao
    var x = 370;
    var y = 550;
    // Adiciona o botao de iniciar
    this.volumeButton = this.game.add.button(x, y, 'music', this.mute, this, 1, 0, 1);
    this.volumeButton.scale.set(1);
    this.volumeButton.anchor.setTo(0.5, 0.5);
    this.volumeButton.inputEnabled = true;
    this.volumeButton.input.useHandCursor = true;
  },
  
  setMuteButton: function () {
    // Define variaveis de posicao
    var x = 370;
    var y = 550;
    // Adiciona o botao de iniciar
    this.muteButton = this.game.add.button(x, y, 'mute', this.mute, this, 1, 0, 1);
    this.muteButton.scale.set(1);
    this.muteButton.anchor.setTo(0.5, 0.5);
    this.muteButton.inputEnabled = true;
    this.muteButton.input.useHandCursor = true;
  },



};