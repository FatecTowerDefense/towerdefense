var menu_state = {
  create: function () {
    // Adiciona o botao de iniciar
    this.setStartButton();
    this.setCreditButton();
  },

  // Vai para o estado de 'start' iniciando o jogo
  start: function () {
    this.game.state.start('play');
  },

  // Vai para o estado de 'credit'
  credit: function () {
    this.game.state.start('credit');
  },


  update: function () {
    // Ha algum problema com a posicao em relacao ao mundo quando retorna ao estado de menu
    // Vou deixar fixo perto para ter menu por enquanto
    this.startButton.x = 380;
    this.startButton.y = 300;

    this.creditButton.x = 380;
    this.creditButton.y = 400;
  },

  setStartButton: function () {
    // Define variaveis de posicao
    var x = this.game.world.width / 2 - 20;
    var y = this.game.world.height / 2;
    // Adiciona o botao de iniciar
    this.startButton = this.game.add.button(x, y, 'start', this.start, this, 1, 0, 1);
    this.startButton.scale.set(0.3);
    this.startButton.anchor.setTo(0.5, 0.5);
    this.startButton.inputEnabled = true;
    this.startButton.input.useHandCursor = true;
  },

  setCreditButton: function () {
    // Define variaveis de posicao
    var x = this.game.world.width / 2 - 20;
    var y = this.game.world.height / 2 + 100;
    // Adiciona o botao de iniciar
    this.creditButton = this.game.add.button(x, y, 'start', this.credit, this, 1, 0, 1);
    this.creditButton.scale.set(0.3);
    this.creditButton.anchor.setTo(0.5, 0.5);
    this.creditButton.inputEnabled = true;
    this.creditButton.input.useHandCursor = true;
  },

};