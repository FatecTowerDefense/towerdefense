/*globals game */
var credit_state = {
  create: function () {
    // Adiciona o botao de iniciar
    this.setMenuButton();
    var text = "Lorem ipsum dolor sit amet - Programmer \n Lorem ipsum dolor sit amet - Disner \n Lorem ipsum dolor sit amet - Programmer \n Lorem ipsum dolor sit amet - Sound Artist \n Lorem ipsum dolor sit amet - Programmer \n Lorem ipsum dolor sit amet - Disner \n Lorem ipsum dolor sit amet - Programmer \n Lorem ipsum dolor sit amet - Sound Artist \n Lorem ipsum dolor sit amet - Programmer \n Lorem ipsum dolor sit amet - Disner \n Lorem ipsum dolor sit amet - Programmer \n Lorem ipsum dolor sit amet - Sound Artist";
    var style = { font: "18px Arial", fill: "#ff0044", align: "center" };

    game.add.text(game.world.centerX - 200, 100, text, style);
  },

  // Vai para o estado de 'menu'
  menu: function () {
    this.game.state.start('menu');
  },

  update: function () {
    // Ha algum problema com a posicao em relacao ao mundo quando retorna ao estado de menu
    // Vou deixar fixo perto para ter menu por enquanto
    this.startButton.x = 650;
    this.startButton.y = 50;
  },

  setMenuButton: function () {
    // Adiciona o botao de voltar para menu
    this.startButton = this.game.add.button(650, 50, 'start', this.menu, this, 1, 0, 1);
    this.startButton.scale.set(0.3);
    this.startButton.anchor.setTo(0.5, 0.5);
    this.startButton.inputEnabled = true;
    this.startButton.input.useHandCursor = true;
  },

};