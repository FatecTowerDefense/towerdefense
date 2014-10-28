/*globals Phaser */
var load_state = {

  preload: function () {
    // Define que nao esta pronto
    this.ready = false;
    // Inicia o carregamento
    this.game.load.start();
    // Adiciona o sprite de loading
    this.loading = this.add.sprite(this.game.world.width / 2 - 50, this.game.world.height / 2 - 50, 'preloader');
    this.loading.anchor.setTo(0.5, 0.5);
    this.loading.scale.set(0.3);
    // Define o sprite como pre loader
    this.game.load.setPreloadSprite(this.loading);

    // Pinta o bg
    this.game.stage.backgroundColor = '#222222';

    // Carrega images sprites
    this.game.load.image('logo', '../../assets/logo/phaser.png');
    this.game.load.image('bullet', '../../assets/sprites/bullet.png');
    this.game.load.image('tower', '../../assets/sprites/tower.png');
    this.game.load.image('tower2', '../../assets/sprites/tower.png');
    this.game.load.image('tower3', '../../assets/sprites/tower.png');
    this.game.load.image('village', '../../assets/sprites/tower.png');
    this.game.load.spritesheet('start', '../../assets/sprites/startsprite.png', 481, 193, 2);
    this.game.load.spritesheet('person', '../../assets/sprites/person.png', 32, 32, 4);

    // Carrega o tilemap - json e imagem
    this.game.load.tilemap('jsonmap', '../../assets/tilemaps/desert.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tilesmap', '../../assets/tilemaps/tmw_desert_spacing.png');

  },

  create: function () {
    // Ao terminar de carregar chamar o metodo loadComplete
    this.game.load.onLoadComplete.addOnce(this.loadComplete, this);
  },

  update: function () {
    // todo frame verifica se ja esta pronto, qd estiver vai para o estado 'menu'
    if (!!this.ready) {
      this.game.state.start('menu');
    }
  },

  loadComplete: function () {
    // Assim que tudo estiver carregado, vai para o estado de 'menu'      
    this.ready = true;
  },

};
