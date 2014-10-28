// Inicializa Phaser
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'towerDefense');

// Define os estados
game.state.add('boot', boot_state);
game.state.add('preload', load_state);
game.state.add('menu', menu_state);
game.state.add('play', play_state);
game.state.add('credit', credit_state);

// Inicia com o estado 'load'
game.state.start('boot');
