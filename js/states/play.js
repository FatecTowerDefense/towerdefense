/*globals  Phaser, Village, Monster, Tower, Wave, Pathfinder */

/* Global Variables */

// Tamanho do tile
var tileSize = 32;
// Inicia onda - level - pontuacao - qtdade de monstros
var waveCurrent = 0;
var levelCurrent = 0;
var waveMonsters = 0;
var score = 0;
// define dinheiro inicial do jogador
var money = 1000;
// Caminho a ser percorrido
var tilePath;
// Grupos
var villages;
var monsters;
var towers;
var bullets;
// texto de status e nivel
var statusText;
var levelTextLevel;
// torres
var tower1;
var tower2;
var tower3;
// musica de fundo
var bgMusic;
// SFX
var sfxVictory;


var play_state = {
  // TODO PRINCIPAL
  // - criar lista de monstros com sprite, forca, vida etc - hj hard coded
  // - criar lista de niveis com detalhes das ondas - hj unico
  // - levar para classe propria a leitura do tileMap para simplificar o uso de varios mapas - hj unico
  // - condicao de vitoria do jogo // hj infinito
  // - splash screen - hj inexistente
  // - tela de derrota - hj inexistente
  // - reset do jogo completo com limpeza dos sprites e variaveis - hj limpa tela e volta para menu
  // - ajustar o preloader - hj com gif circular e nao barra
  // - criar validacao de posicionamento de novas torres - checar se nao e caminho e se ja nao existe uma torre la -- lista com esses pontos
  // - criar dentro do estado de play os estados de inclusao de torre e de ondas - trabalhar com o tempo de onda - hj inexistente
  // - criar sistema de upgrade para torres // acredito que remover a torre atual e aplicar uma nova com as novas prorpiedades seja o melhor - hj inexistente
  // - criar sistema de caixa de selecao para o upgrade das torres - hj inexistente
  // - criar textos de contador de tempo para proxima onda - hj inexistente
  // - melhorar AI da torre - hj ataca o primeiro no range
  // - ajuste de performance - destruir objetos ao inves de os limpar da tela
  // - Polimento do jogo e ajuste de classes para facilitar manutencao
  // - Caso tudo seja atingido verificar de utilizar pathfinding a star ao inves de mapear o caminho manualmente
  // - Caso pathfinding seja atingido - inserir barreiras destrutiveis no jogo

  create: function () {
    // Inicia a fisica do jogo
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // Cria e aplica o tile map
    var map = this.game.add.tilemap('jsonmap');
		
		//pega imagens do tileset: primeiro argumento eh o nome desse tileset no JSON;
		//o segundo eh a chave da imagem do tileset, criada no preload
    map.addTilesetImage('tileSet', 'tilesmap');
		//cria camada definida no JSON
    var layer = map.createLayer('buildables');
		
    layer.resizeWorld();
    // caminho a ser percorrido pelos monstros
    /*tilePath = [{x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 4}, {x: 2, y: 5}, {x: 2, y: 6},
      {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 7, y: 6}, {x: 8, y: 6}, {x: 9, y: 6}, {x: 10, y: 6},
      {x: 10, y: 7}, {x: 11, y: 7}, {x: 12, y: 7}, {x: 13, y: 7}, {x: 13, y: 8}, {x: 14, y: 8}, {x: 15, y: 8}, {x: 16, y: 8},
      {x: 16, y: 9}, {x: 16, y: 10}, {x: 17, y: 10}, {x: 18, y: 10}, {x: 19, y: 10}, {x: 20, y: 10}, {x: 20, y: 11}, {x: 21, y: 11},
      {x: 22, y: 11}, {x: 23, y: 11}, {x: 24, y: 11}, {x: 25, y: 11}];*/
		
		tilePath = this.calcPath(map, layer);
    // Cria grupo para Vila para facilicar a colisao com mudanca de vila entre os niveis
    villages = this.game.add.group();
    villages.enableBody = true;
    this.game.physics.enable(villages, Phaser.Physics.ARCADE);
    // Cria a Vila a ser defendida
    new Village('village', 100);

    // Cria grupo de monstros
    monsters = this.game.add.group();
    monsters.enableBody = true;
    this.game.physics.enable(monsters, Phaser.Physics.ARCADE);

    // Cria grupo de torres
    towers = this.game.add.group();
    towers.enableBody = true;
    this.game.physics.enable(towers, Phaser.Physics.ARCADE);

    // Cria grupo de balas
    bullets = this.game.add.group();
    bullets.enableBody = true;
    this.game.physics.enable(bullets, Phaser.Physics.ARCADE);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 0.5);

    // Adiciona botao de iniciar para iniciar a onda
    this.startWaveButton = this.game.add.button(650, 50, 'start', this.newWave, this, 1, 0, 1);
    this.startWaveButton.scale.set(0.3);
    this.startWaveButton.anchor.setTo(0.5, 0.5);
    this.startWaveButton.inputEnabled = true;
    this.startWaveButton.input.useHandCursor = true;

    // Adiciona botao de voltar ao menu
    // TODO - remover os objetos e limpar dados antes de voltar
    this.stopButton = this.game.add.button(650, 140, 'start', this.restartGame, this, 1, 0, 1);
    this.stopButton.scale.set(0.3);
    this.stopButton.tint = 0xff00ff;
    this.stopButton.anchor.setTo(0.5, 0.5);
    this.stopButton.inputEnabled = true;
    this.stopButton.input.useHandCursor = true;

    // Desenha um retângulo de menu de botões na parte inferior
    var shape = this.game.add.graphics(0, 0); // inicia o retangulo
    shape.lineStyle(2, 0x000000, 0.8); // largura, cor, alfa
    shape.beginFill(0x222222, 0.8); // cor, alfa
    shape.drawRect(0, (this.game.height / 5) * 4, this.game.width, this.game.height / 5); // x, y, largura, altura
    shape.endFill();

    // Cria textos de pontuacao dinheiro e onda
    var text = "Money: " + money + " \nScore: " + score;
    var style = { font: "14px Arial", fill: "#000000", align: "left" };
    statusText = this.game.add.text(10, 10, text, style);

    // Cria textos de Level e Onda
    var textLevel = "Level: " + levelCurrent + " \nWave: " + waveCurrent;
    var styleLevel = { font: "14px Arial", fill: "#000000", align: "left" };
    levelTextLevel = this.game.add.text(200, 10, textLevel, styleLevel);

    // Desenha os botes de adicionar torre
    // Torre Tipo 1
    this.game.add.sprite(96, 512, 'tower');
    tower1 = this.game.add.sprite(96, 512, 'tower');
    tower1.inputEnabled = true;
    tower1.input.enableDrag();
    tower1.input.enableSnap(32, 32, true, true);
    tower1.events.onDragStop.add(this.onDragStop, this);
    // texto da torre
    text = "Tower 1 \n $100 \n Constant ";
    style = { font: "11px Arial", fill: "#FFFFFF", align: "center" };
    this.game.add.text(88, 546, text, style);

    // Torre Tipo 2
    this.game.add.sprite(160, 512, 'tower2');
    tower2 = this.game.add.sprite(160, 512, 'tower2');
    tower2.inputEnabled = true;
    tower2.input.enableDrag();
    tower2.input.enableSnap(32, 32, true, true);
    tower2.events.onDragStop.add(this.onDragStop, this);
    // texto da torre
    text = "Tower 2 \n $300 \n Power";
    this.game.add.text(152, 546, text, style);

    // Torre Tipo 3
    this.game.add.sprite(224, 512, 'tower3');
    tower3 = this.game.add.sprite(224, 512, 'tower3');
    tower3.inputEnabled = true;
    tower3.input.enableDrag();
    tower3.input.enableSnap(32, 32, true, true);
    tower3.events.onDragStop.add(this.onDragStop, this);
    // texto da torre
    text = "Tower 3 \n $150 \n Rapid Fire ";
    this.game.add.text(216, 546, text, style);
    
    // Música de fundo da fase
    bgMusic = this.game.add.audio('level1');
    bgMusic.play('', 0, 1, true);

    // SFX
    sfxVictory = this.game.add.audio('victory');
  },

  update: function () {
    // Verifica se ha monstros para iniciar proxima onda
    this.checkWaveEnd();

    // Faz cada monstro andar
    monsters.forEach(function (monster) {
      Monster.prototype.move(monster);
    });

    // Faz cada torre verificar o range
    towers.forEach(function (tower) {
      Tower.prototype.attack(tower);
    });

    // Verifica colisao da bala com monstro
    this.game.physics.arcade.overlap(bullets, monsters, this.collisionChecker, null, this);

    // Verifica colisao de inimigo com vila
    this.game.physics.arcade.overlap(villages, monsters, Village.prototype.damageTaken, null, this);

    // Atualiza textos de status
    this.updateTexts();
  },

  onDragStop: function (sprite, pointer) {
    // TODO - checar se pode adicionar o sprite na posicao
    var x = pointer.x;
    var y = pointer.y;
    var offsetX, offsetY, damage, range, fireRate, health, imortal, bulletSpeed, price, bulletSprite;
    if (sprite.key === 'tower') {
			sprite = 'tower';
			damage =  50;
			range =  6;
			fireRate =  1500;
			health =  1000;
			imortal =  true;
			bulletSpeed =  50;
			price =  100;
			bulletSprite = 'bullet';

			//valores gritantes de offset soh para testar
			offsetX = 70;
			offsetY = 10;

			tower1.x = 96;
			tower1.y = 512;
    } else if (sprite.key === 'tower2') {
      sprite = 'tower2';
      damage =  300;
      range =  4;
      fireRate =  2500;
      health =  1000;
      imortal =  true;
      bulletSpeed =  40;
      price =  300;
      bulletSprite = 'bullet';
			
			offsetX = 0;
			offsetY = 10;
			
      tower2.x = 160;
      tower2.y = 512;
    } else if (sprite.key === 'tower3') {
      sprite = 'tower3';
      damage =  15;
      range =  5;
      fireRate =  500;
      health =  1000;
      imortal =  true;
      bulletSpeed =  75;
      price =  150;
      bulletSprite = 'bullet';
			
			offsetX = 0;
			offsetY = 0;
			
      tower3.x = 224;
      tower3.y = 512;
    }
    if (money >= price) {
      new Tower(x, y, offsetX, offsetY, sprite, damage, range, fireRate, health, imortal, bulletSpeed, price, bulletSprite);
    } else {
      this.console.log('Você não possui dinheiro suficiente para comprar esta torre!');
    }
  },

  updateTexts: function () {
    statusText.setText("Money: " + money + " \nScore: " + score);
  },

  checkWaveEnd: function () {
    // TODO - verificar se todos os monstros ja morreram e iniciar proxima onda
    if (waveMonsters === 0) {
      if (waveCurrent !== 0) {
        sfxVictory.play();
      }
      this.newWave();
    }
  },

  restartGame: function () {
    // Voltar para o estado 'menu'
    this.game.world.removeAll();
    this.game.state.start('menu');
    //Encerra a música e o SFX da fase
    bgMusic.stop();
    if (sfxVictory.isPlaying) {
      sfxVictory.stop();
    }

    // TODO limpar as variaveis e resetar os timers quando rodando
  },

  newWave: function () {
    // cria uma nova onda
    // formato de envio dos monstros da onda: [{sprite:'person', amount:3},{sprite:'person', amount:3}]
    // Pode intercalar e repetir monstros e sequencias
    // Ele deixa um espaço vazio entre cada item da onda
    waveCurrent++;
    new Wave([{sprite: 'person', amount: 3}, {sprite: 'person', amount: 2}], 5000, 1000, 250, tilePath[0].x, tilePath[0].y);
    if (waveCurrent > 3) {
      waveCurrent = 1;
      levelCurrent++;
    }
    levelTextLevel.setText("Level: " + levelCurrent + " \nWave: " + waveCurrent);
  },

  collisionChecker: function (bullet, monster) {
    // destroi a bala
    bullet.kill();
    // tira o dano do monstro
    monster.health -= bullet.damage;
    // manda o monstro verificar se morreu
    Monster.prototype.death(monster);
  },
	
	calcPath : function (tilemap, layer) {
	//tentativa de pathfinding. vamulaaaa
	//esse eh o array que sera retornado para o tilePAth
	//e o x e y da base ou torre defendida
		var pathArray = [], yDetect, xDetect, oldTile;

		//primeiro de tudo, encontra o tile que foi marcado como base no tilemap
		//indice da base no JSON = 1, layer = buildables
		for (yDetect = 0; yDetect < tilemap.height; yDetect++) {
			for (xDetect = 0; xDetect < tilemap.width; xDetect++) {
				var tile = tilemap.getTile(xDetect, yDetect, layer, true);
				if (tile.index === 1) {
					console.log("Base em " + xDetect + ", " + yDetect);
					pathArray.unshift({x : xDetect, y : yDetect});
					break;
				}

			}

			if (pathArray.length > 0) {
				//ja achou, paraaaa
				break;
			}
		}
		
		
		
		//agora, confere os tiles ao redor da base para encontrar um tile marcado com index de path (4)
		//adiciona no pathArray quando achar
		//valores iniciais de previous x e y malucos para ele nao desprezar nenhum lado
		var tileToAdd = this.checkIndexAroundTile(tilemap, layer, 4, xDetect, yDetect, -50, -50);



		if (tileToAdd !== null) {
			pathArray.unshift({x : tileToAdd.x, y : tileToAdd.y});
			oldTile = pathArray[1];
		} else {
			this.console.error("nenhum caminho encontrado partindo da base (pelo menos a base foi encontrada)!");
			return null;
		}

		//vai adicionando os pontos ate nao encontrar nenhum
		while (tileToAdd !== null) {

			tileToAdd = this.checkIndexAroundTile(tilemap, layer, 4, tileToAdd.x, tileToAdd.y, oldTile.x, oldTile.y);
			if (tileToAdd !== null) {
				pathArray.unshift({x : tileToAdd.x, y : tileToAdd.y});
				oldTile = pathArray[1];
			} else {
				console.log("caminho calculado!");
				return pathArray;
			}


		}

		
	},
	
	checkIndexAroundTile : function (tilemap, layer, desiredIndex, tileX, tileY, previousX, previousY) {
		
		//console.log(tilemap.layers[0].data[0]
		//console.log(layer);

		var tile = tilemap.getTile(tileX + 1, tileY, layer, true);
		//console.log((tileX - 1) + ", " + tileY);
		//console.log(tilemap.getTile(tileX - 1, tileY, layer, true));

		if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX + 1) || (previousY !== tileY))) {
			//console.log("Mais um node em " + (tileX + 1) + ", " + (tileY));
			return tile;
		} else {

			tile = tilemap.getTile(tileX, tileY + 1, layer, true);
			if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX) || (previousY !== tileY + 1))) {
				//console.log("Mais um node em " + (tileX) + ", " + (tileY + 1));
				return tile;
			} else {

				tile = tilemap.getTile(tileX - 1, tileY, layer, true);
				if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX - 1) || (previousY !== tileY))) {
					//console.log("Mais um node em " + (tileX - 1) + ", " + (tileY));
					return tile;
				} else {

					tile = tilemap.getTile(tileX, tileY - 1, layer, true);
					if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX) || (previousY !== tileY - 1))) {
						//console.log("Mais um node em " + (tileX) + ", " + (tileY - 1));
						return tile;
					} else {
					//console.log("Acabou o caminho");
						return null;
					}
				}
			}
		}
		
	}
	

};