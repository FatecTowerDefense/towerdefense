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
    this.game.load.image('arrow', '../../assets/sprites/bulletArrow.png');
    this.game.load.image('arrow_fire', '../../assets/sprites/bulletArrow_Fire.png');
    this.game.load.image('arrow_power', '../../assets/sprites/bulletArrow_Power.png');
    this.game.load.image('tower', '../../assets/sprites/tower1.png');
    this.game.load.image('tower2', '../../assets/sprites/tower1.png');
    this.game.load.image('tower3', '../../assets/sprites/tower2.png');
    this.game.load.image('village', '../../assets/sprites/village.png');
    this.game.load.image('logo', '../../assets/sprites/poguiraslogo.png');
    this.game.load.image('bambu', '../../assets/sprites/bambu.png');
    this.game.load.image('aldeiaDefendidaPlaca', '../../assets/sprites/aldeiaDefendidaPlaca.png');
    this.game.load.image('aldeiaDestruidaPlaca', '../../assets/sprites/aldeiaDestruidaPlaca.png');
    this.game.load.image('aldeiaDefendida', '../../assets/sprites/aldeiaDefendida.png');
    this.game.load.image('aldeiaDestruida', '../../assets/sprites/aldeiaDefendida.png');
    this.game.load.spritesheet('start', '../../assets/sprites/startsprite.png', 481, 193, 2);
    this.game.load.spritesheet('play', '../../assets/sprites/playbuttonprite.png', 256, 161, 2);
    this.game.load.spritesheet('credit', '../../assets/sprites/creditbuttonprite.png', 114, 96, 2);
    this.game.load.spritesheet('curupira', '../../assets/sprites/curupira.png', 32, 32, 14);
    this.game.load.spritesheet('corposeco', '../../assets/sprites/corposeco.png', 32, 32, 14);
    this.game.load.spritesheet('saci', '../../assets/sprites/Saci.png', 32, 32, 22);
    this.game.load.spritesheet('mula', '../../assets/sprites/mula64.png', 64, 64, 19);
    this.game.load.spritesheet('music', '../../assets/sprites/musicbuttonsprite.png', 114, 96, 2);
    this.game.load.spritesheet('mute', '../../assets/sprites/mutebuttonsprite.png', 114, 96, 2);
    this.game.load.spritesheet('fechar', '../../assets/sprites/fecharbuttonsprite.png', 128, 95, 2);
    this.game.load.spritesheet('retornar', '../../assets/sprites/retornarbuttonsprite.png', 128, 95, 2);
    this.game.load.spritesheet('avancar', '../../assets/sprites/avancarbuttonsprite.png', 128, 95, 2);

    // Carrega o tilemap - json e imagem
    this.game.load.tilemap('jsonmap', '../../assets/tilemaps/fase1Teste.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tilesmap', '../../assets/tilemaps/tileSet.png');
		this.game.load.image('map1Image', '../../assets/tilemaps/mapa_1Art.png');
		this.game.load.image('map2Image', '../../assets/tilemaps/mapa_2Art.png');
		this.game.load.image('map3Image', '../../assets/tilemaps/mapa_3Art.png');
    
    // Carrega os arquivos de SFX do jogo
    this.game.load.audio('victory', '../../assets/audio/victory.ogg', '../../assets/audio/victory.mp3');
    this.game.load.audio('gameover', '../../assets/audio/gameover.ogg', '../../assets/audio/gameover.mp3');
    this.game.load.audio('towerCreated', '../../assets/audio/towerCreated.ogg', '../../assets/audio/towerCreated.mp3');
    this.game.load.audio('baseAttacked', '../../assets/audio/baseAttacked.ogg', '../../assets/audio/baseAttacked.mp3');
    this.game.load.audio('towerFire', '../../assets/audio/hit.ogg', '../../assets/audio/hit.mp3');
    
    // Carrega os arquivos de BGM do jogo
    this.game.load.audio('level1', '../../assets/audio/level1.ogg', '../../assets/audio/victory.mp3');
    this.game.load.audio('menu', '../../assets/audio/menu.ogg', '../../assets/audio/menu.mp3');
    
    //json monstrao
    this.game.load.text('monsterJson', '../../assets/tilemaps/monsterJson.json');
  },

  create: function () {
    // Ao terminar de carregar chamar o metodo loadComplete
    this.game.load.onLoadComplete.addOnce(this.loadComplete, this);
  },

  update: function () {
    // todo frame verifica se ja esta pronto, qd estiver vai para o estado 'menu'
    if (this.cache.isSoundDecoded('menu') && 
        this.cache.isSoundDecoded('gameover') &&
        this.cache.isSoundDecoded('towerCreated') &&
        this.cache.isSoundDecoded('victory') &&
        this.cache.isSoundDecoded('level1') &&
        this.cache.isSoundDecoded('baseAttacked') &&
        this.cache.isSoundDecoded('towerFire'))
    {
      if (this.ready) {
        this.game.state.start('menu');
      }
    }
  },

  loadComplete: function () {
    // Assim que tudo estiver carregado, vai para o estado de 'menu'
    this.ready = true;
  },

};
