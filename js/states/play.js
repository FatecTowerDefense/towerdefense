/*globals  Phaser, Village, Monster, Tower, Wave, monstersBlock, waveStartTime */

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
// var levelTextLevel;
// torres
var tower1;
var tower2;
var tower3;
// musica de fundo
var bgMusic;
// SFX
var sfxVictory;
var sfxTower;
var sfxNoMoney;

//tilemap e layer que controla caminho e locais onde da pra construir
var map;
var layer;
var fundoSprite;

var bambuDireita;
var bambuEsquerda;

var muteX = 130;

var monsterProps;

var play_state = {
  // TODO PRINCIPAL
  // - levar para classe propria a leitura do tileMap para simplificar o uso de varios mapas - hj unico
  // - splash screen - hj inexistente
  // - reset do jogo completo com limpeza dos sprites e variaveis - hj limpa tela e volta para menu
  // - ajustar o preloader - hj com gif circular e nao barra
  // - criar dentro do estado de play os estados de inclusao de torre e de ondas - trabalhar com o tempo de onda - hj inexistente
  // - criar textos de contador de tempo para proxima onda - hj inexistente
  // - ajuste de performance - destruir objetos ao inves de os limpar da tela
  // - Polimento do jogo e ajuste de classes para facilitar manutencao
  // - Caso tudo seja atingido verificar de utilizar pathfinding a star ao inves de mapear o caminho manualmente
  // - Caso pathfinding seja atingido - inserir barreiras destrutiveis no jogo

  create: function () {
    // Inicia a fisica do jogo
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // Cria e aplica o tile map
    map = this.game.add.tilemap('jsonmap');

		//pega imagens do tileset: primeiro argumento eh o nome desse tileset no JSON;
		//o segundo eh a chave da imagem do tileset, criada no preload
    map.addTilesetImage('tileSet', 'tilesmap');

    monsterProps = JSON.parse(this.game.cache.getText('monsterJson'));
		//pega outra imagem do tileset, essa eh um tile gigante, que ocupa o mapa inteiro, pra mostrar o cenario
		//map.addTilesetImage('map1Img', 'map1Image');
		//cria camadas definidas no JSON
    layer = map.createLayer('buildables');
    //var imgLayer = map.createLayer('scenario');

    fundoSprite = this.game.add.sprite(0,0, 'map1Image');


    layer.resizeWorld();
    // (antigo) caminho a ser percorrido pelos monstros
    /*tilePath = [{x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 4}, {x: 2, y: 5}, {x: 2, y: 6},
      {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 7, y: 6}, {x: 8, y: 6}, {x: 9, y: 6}, {x: 10, y: 6},
      {x: 10, y: 7}, {x: 11, y: 7}, {x: 12, y: 7}, {x: 13, y: 7}, {x: 13, y: 8}, {x: 14, y: 8}, {x: 15, y: 8}, {x: 16, y: 8},
      {x: 16, y: 9}, {x: 16, y: 10}, {x: 17, y: 10}, {x: 18, y: 10}, {x: 19, y: 10}, {x: 20, y: 10}, {x: 20, y: 11}, {x: 21, y: 11},
      {x: 22, y: 11}, {x: 23, y: 11}, {x: 24, y: 11}, {x: 25, y: 11}];*/

		//caminho sendo calculado
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

    // Desenha um retângulo de menu de botões na parte inferior
    var shape = this.game.add.graphics(0, 0); // inicia o retangulo
    shape.lineStyle(2, 0x000000, 0.8); // largura, cor, alfa
    shape.beginFill(0x222222, 0.8); // cor, alfa
    shape.drawRect(0, 650, this.game.width, 128); // x, y, largura, altura
    shape.endFill();

    // Adiciona botao de iniciar para iniciar a onda
    this.startWaveButton = this.game.add.button(555, this.game.height-50, 'play', this.newWave, this, 1, 0, 1);
    this.startWaveButton.scale.set(0.3);
    this.startWaveButton.anchor.setTo(0.5, 0.5);
    this.startWaveButton.inputEnabled = true;
    this.startWaveButton.input.useHandCursor = true;

    // Adiciona botao de voltar ao menu
    // TODO - remover os objetos e limpar dados antes de voltar
    this.stopButton = this.game.add.button(50, 50, 'fechar', this.pauseGame, this, 1, 0, 1);
    this.stopButton.scale.set(0.5);
    this.stopButton.anchor.setTo(0.5, 0.5);
    this.stopButton.inputEnabled = true;
    this.stopButton.input.useHandCursor = true;

    this.muteButton = this.game.add.button(muteX, 50, 'mute', this.mute, this, 1, 0, 1);
    this.muteButton.scale.set(0.5);
    this.muteButton.anchor.setTo(0.5, 0.5);
    this.muteButton.inputEnabled = true;
    this.muteButton.input.useHandCursor = true;

    this.volumeButton = this.game.add.button(muteX, 50, 'music', this.mute, this, 1, 0, 1);
    this.volumeButton.scale.set(0.5);
    this.volumeButton.anchor.setTo(0.5, 0.5);
    this.volumeButton.inputEnabled = true;
    this.volumeButton.input.useHandCursor = true;

    // Cria textos de pontuacao dinheiro e onda
    // var text = "Money: " + money + " \nScore: " + score;
    var text = "$ " + money;
    var style = { font: "14px Arial", fill: "#FFFFFF", align: "left" };
    statusText = this.game.add.text(550,  this.game.height-100, text, style);

    // Cria textos de Level e Onda
    var textLevel = "Level: " + levelCurrent + " \nWave: " + waveCurrent;
    var styleLevel = { font: "14px Arial", fill: "#FFFFFF", align: "left" };
    // levelTextLevel = this.game.add.text(200, 10, textLevel, styleLevel);

    // Desenha os botes de adicionar torre
    // Torre Tipo 1
    this.game.add.sprite(55, 672, 'tower');
    tower1 = this.game.add.sprite(55, 672, 'tower');
    tower1.inputEnabled = true;
    tower1.input.enableDrag();
    tower1.input.enableSnap(32, 32, true, true);
    tower1.events.onDragStop.add(this.onDragStop, this);
    // texto da torre
    text = "Constant ";
    style = { font: "11px Arial", fill: "#FFFFFF", align: "center" };
    var style2 = { font: "16px Arial", fill: "#FFFFFF", align: "center" };
    this.game.add.text(64, 654, text, style);

    text = "$100 \n 10";
    this.game.add.text(112, 690, text, style2);

    // Torre Tipo 2
    this.game.add.sprite(160, 672, 'tower2');
    tower2 = this.game.add.sprite(160, 672, 'tower2');
    tower2.inputEnabled = true;
    tower2.input.enableDrag();
    tower2.input.enableSnap(32, 32, true, true);
    tower2.events.onDragStop.add(this.onDragStop, this);
    // texto da torre
    text = "Power";
    this.game.add.text(178, 654, text, style);

    text = "$300 \n 10";
    this.game.add.text(217, 690, text, style2);

    // Torre Tipo 3
    this.game.add.sprite(256, 672, 'tower3');
    tower3 = this.game.add.sprite(256, 672, 'tower3');
    tower3.inputEnabled = true;
    tower3.input.enableDrag();
    tower3.input.enableSnap(32, 32, true, true);
    tower3.events.onDragStop.add(this.onDragStop, this);
    // texto da torre
    text = "Rapid Fire";
    this.game.add.text(265, 654, text, style);

    text = "$150 \n 10";
    this.game.add.text(310, 690, text, style2);

    // Música de fundo da fase
    bgMusic = this.game.add.audio('level1');
    bgMusic.play('', 0, 1, true);

    // SFX
    sfxVictory = this.game.add.audio('victory');
    sfxTower = this.game.add.audio('towerCreated');
    sfxNoMoney = this.game.add.audio('noMoney');

    // inicializa valores - level - pontuacao - qtdade de monstros
    waveCurrent = 0;
    levelCurrent = 0;
    waveMonsters = 0;
    score = 0;
    // define dinheiro inicial do jogador
    money = 1000;

    // zera timers
    if (typeof monstersBlock != 'undefined') {
      clearTimeout(monstersBlock);
    }
    if (typeof waveStartTime != 'undefined') {
      clearTimeout(waveStartTime);
    }

    // cortina de bambu

    bambuDireita = this.game.add.sprite(0,0, 'bambu2');
    bambuDireita.scale.set(1);
    bambuEsquerda = this.game.add.sprite(0,0,'bambu');
    bambuEsquerda.scale.set(1);

  },

  update: function () {
    // Abre as cortinas
    this.abreCortinas();

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

    if (this.game.sound.mute === false) {
        this.muteButton.x = 1370;
        this.volumeButton.x = muteX;
      } else {
        this.muteButton.x = muteX;
        this.volumeButton.x = 1370;
      }
  },

  abreCortinas: function () {
    if (bambuDireita.x < 780) {
      bambuEsquerda.x -=2;
      bambuDireita.x +=2;
    }
  },

  pauseGame: function () {
    this.game.paused = true;
    console.log(this.game.paused);
    // Desenha um retângulo de menu de botões na parte inferior
    this.mascara = this.game.add.graphics(0, 0); // inicia o retangulo
    this.mascara.lineStyle(10, 0x000000, 0.8); // largura, cor, alfa
    this.mascara.beginFill(0x222222, 0.7); // cor, alfa
    this.mascara.drawRect(0, 0, this.game.width, this.game.height); // x, y, largura, altura
    this.mascara.endFill();
    this.stopButton.bringToTop();

    this.game.input.onDown.add(this.unpauseGame, this);
  },

  unpauseGame: function () {
    this.game.paused = false;
    this.mascara.destroy();
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
			bulletSpeed =  80;
			price =  100;
			bulletSprite = 'arrow_fire';

			offsetX = 30;
			offsetY = 20;

			tower1.x = 55;
			tower1.y = 672;
    } else if (sprite.key === 'tower2') {
      sprite = 'tower2';
      damage =  300;
      range =  4;
      fireRate =  2500;
      health =  1000;
      imortal =  true;
      bulletSpeed =  75;
      price =  300;
      bulletSprite = 'arrow_power';

			offsetX = 30;
			offsetY = 20;

      tower2.x = 160;
      tower2.y = 672;
    } else if (sprite.key === 'tower3') {
      sprite = 'tower3';
      damage =  15;
      range =  5;
      fireRate =  500;
      health =  1000;
      imortal =  true;
      bulletSpeed =  90;
      price =  150;
      bulletSprite = 'arrow';

			offsetX = 30;
			offsetY = 24;

      tower3.x = 256;
      tower3.y = 672;
    }
    if (money >= price) {
      var tileTarget = this.isTileBuildable(x, y, map, layer, 2, 3);
      if(tileTarget !== null){
        new Tower(tileTarget.worldX, tileTarget.worldY, offsetX, offsetY, sprite, damage, range, fireRate, health, imortal, bulletSpeed, price, bulletSprite);
        sfxTower.play();
      } else {
        console.log('Não há espaço para construir essa torre!');
      }

    } else {
      sfxNoMoney.play();
      console.log('Você não possui dinheiro suficiente para comprar esta torre!');
    }
  },

  updateTexts: function () {
    // statusText.setText("Money: " + money + " \nScore: " + score);
    statusText.setText("$ " + money);
  },

  checkWaveEnd: function () {
    // TODO - verificar se todos os monstros ja morreram e iniciar proxima onda
    if (waveMonsters === 0) {
      if (waveCurrent !== 0) {
        sfxVictory.play();
      }
      if (levelCurrent < 3) {
        this.newWave();
      }
    }
  },

  restartGame: function () {
    //Encerra a música e o SFX da fase
    bgMusic.stop();
    if (sfxVictory.isPlaying) {
      sfxVictory.stop();
    }
    // Voltar para o estado 'menu'
    this.game.world.removeAll();
    this.game.state.start('menu');

    // TODO limpar as variaveis e resetar os timers quando rodando
  },

  newWave: function () {
    var waveContent;
    if(levelCurrent > 1){
      waveContent = [{sprite: 'curupira', amount: 8 + waveCurrent * levelCurrent}, {sprite: 'saci', amount: 4 + waveCurrent * levelCurrent}, {sprite:'mula', amount: 5 + waveCurrent * levelCurrent}, {sprite: 'corposeco', amount: 6 + waveCurrent * levelCurrent * 2}];


    }else{
      waveContent = [{sprite: 'curupira', amount: 6 + waveCurrent * 2 * levelCurrent}, {sprite: 'saci', amount: 4 + waveCurrent * levelCurrent}, {sprite:'mula', amount: 5 + waveCurrent * levelCurrent}];

    }

    // cria uma nova onda
    // formato de envio dos monstros da onda: [{sprite:'person', amount:3},{sprite:'person', amount:3}]
    // Pode intercalar e repetir monstros e sequencias
    // Ele deixa um espaço vazio entre cada item da onda
    waveCurrent++;
    console.log('wave');
    new Wave(waveContent, 5000, 1000, 250);
    if (waveCurrent > 3) {
      waveCurrent = 1;
      levelCurrent++;
      switch (levelCurrent) {
        case  1:
          fundoSprite.loadTexture('map2Image');
          console.log('mudou nivel, mudou fundo');
          break;

        case 2:
          fundoSprite.loadTexture('map3Image');
          console.log('mudou nivel, mudou fundo');
          break;

        case 3:
          bgMusic.stop();
          sfxVictory.play();

          // limpa a tela
          this.game.world.removeAll();
          if (typeof monstersBlock != 'undefined') {
            clearTimeout(monstersBlock);
          }
          if (typeof waveStartTime != 'undefined') {
            clearTimeout(waveStartTime);
          }

          waveMonsters = 10;

          // adiciona imagens
          this.game.add.sprite(0, 0, 'aldeiaDefendida');
          this.game.add.sprite(50, 0, 'aldeiaDefendidaPlaca');

          // adiciona os botoes

          // botoes de fechar
          var x = 230;
          var y = 250;
          this.game.fecharButton = this.game.add.button(x, y, 'fechar', this.fechar, this, 1, 0, 1);
          this.game.fecharButton.scale.set(1);
          this.game.fecharButton.anchor.setTo(0.5, 0.5);
          this.game.fecharButton.inputEnabled = true;
          this.game.fecharButton.input.useHandCursor = true;
          // botoes de voltar
          x = 370;
          y = 250;
          // Adiciona o botao de iniciar
          this.game.retornarButton = this.game.add.button(x, y, 'retornar', this.retornar, this, 1, 0, 1);
          this.game.retornarButton.scale.set(1);
          this.game.retornarButton.anchor.setTo(0.5, 0.5);
          this.game.retornarButton.inputEnabled = true;
          this.game.retornarButton.input.useHandCursor = true;

          console.log('ganhoooooo');
          break;

        default:
          console.log('eu nao devia aparecer');
          break;
      }


    }
    // levelTextLevel.setText("Level: " + levelCurrent + " \nWave: " + waveCurrent);
  },


  fechar: function () {
    this.game.state.start('menu');
  },

  retornar: function () {
    this.game.state.start('play');
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
					//console.log("Base em " + xDetect + ", " + yDetect);
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
				//console.log("caminho calculado!");
				return pathArray;
			}


		}


	},

	checkIndexAroundTile : function (tilemap, layer, desiredIndex, tileX, tileY, previousX, previousY) {



		var tile = tilemap.getTile(tileX + 1, tileY, layer, true);

		if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX + 1) || (previousY !== tileY))) {
			return tile;
		} else {

			tile = tilemap.getTile(tileX, tileY + 1, layer, true);
			if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX) || (previousY !== tileY + 1))) {
				return tile;
			} else {

				tile = tilemap.getTile(tileX - 1, tileY, layer, true);
				if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX - 1) || (previousY !== tileY))) {
					return tile;
				} else {

					tile = tilemap.getTile(tileX, tileY - 1, layer, true);
					if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX) || (previousY !== tileY - 1))) {
						return tile;
					} else {
						return null;
					}
				}
			}
		}

	},


	checkIndexDirectionRestricted : function (tilemap, layer, desiredIndex, tileX, tileY, previousX, previousY, horizontalCheck) {
	  //restringe horizontal ou verticalmente a busca por tiles com indice desejado

	  var tile;

	  if(horizontalCheck){
	    tile = tilemap.getTile(tileX + 1, tileY, layer, true);

	    if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX + 1) || (previousY !== tileY))) {
			  return tile;
		  } else {
		    tile = tilemap.getTile(tileX - 1, tileY, layer, true);

		    if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX - 1) || (previousY !== tileY))) {
					return tile;
				} else {
				  return null;
				}
		  }

	  }else{

	    //vertical entao

	    tile = tilemap.getTile(tileX, tileY + 1, layer, true);

			if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX) || (previousY !== tileY + 1))) {
				return tile;
			} else {

			  tile = tilemap.getTile(tileX, tileY - 1, layer, true);

					if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX) || (previousY !== tileY - 1))) {
						return tile;
					} else {
						return null;
					}
			}

	  }


	},


	isTileBuildable : function (x, y, tileMap, layer, buildableIndex, unBuildableIndex) {

	  //o tile sobre o qual o mouse esta
	  var tile = tileMap.getTileWorldXY(x, y, 32, 32, layer);

	  //indice do tile buildable no tileset = 2

	  if(tile.index === buildableIndex) {

	    var tileDoLado, tileVert;
	    //bom, tem um tile onde da pra construir aqui
	    //agora, a gente precisa ver se tem outros ao redor.
	    //a gente precisa de uma area de 2x2 pra botar a torre

	    //primeiro checando horizontalmente
	    tileDoLado = this.checkIndexDirectionRestricted(tileMap, layer, buildableIndex, tile.x, tile.y, -20, -20, true);
	    if(tileDoLado !== null){
	      //legal, tem um tile onde da pra construir do lado
	      //vamos checar vertical entao
	      tileVert = this.checkIndexDirectionRestricted(tileMap, layer, buildableIndex, tile.x, tile.y, -20, -20, false);

	      if(tileVert !== null){
	        //tamo quase deixando construir essa torre, mas falta mais uma coisin:
	        //precisamos do quarto espaco
	        //pega o y do tilevert junto com o x do tiledolado pra ver se esse quarto eh buildable
	        var quartoTile = tileMap.getTile(tileDoLado.x, tileVert.y, layer, true);

	        if ((quartoTile) && (quartoTile.index === buildableIndex)) {
	          //aeeee, constroi o baguio
	          if(tileDoLado.x < tile.x){
	            if(tileVert.y < tile.y){
	              //marca todos os tiles usados por essa torre como inapropriados para construcao
	              this.setIndex([tile, tileVert, tileDoLado, quartoTile], unBuildableIndex);
	              return quartoTile;
	            } else {
	              //marca todos os tiles usados por essa torre como inapropriados para construcao
	              this.setIndex([tile, tileVert, tileDoLado, quartoTile], unBuildableIndex);
	              return tileDoLado;
	            }

	          } else {
	            if(tileVert.y < tile.y) {
	              //marca todos os tiles usados por essa torre como inapropriados para construcao
	              this.setIndex([tile, tileVert, tileDoLado, quartoTile], unBuildableIndex);
	              return tileVert;
	            } else {
	              //marca todos os tiles usados por essa torre como inapropriados para construcao
	              this.setIndex([tile, tileVert, tileDoLado, quartoTile], unBuildableIndex);
	              return tile;
	            }
	          }
					} else {
					  //fracassou
					  return null;
					}

	      } else {
	        //apertado demais
	        return null;
	      }
	    } else {
	      //cancela essa construcao, nao tem espaco horizontal onde foi especificado
	      return null;
	    }



	  } else {
	    return null;
	  }


	},


	setIndex : function (tilesArray, desiredIndex){
	  for(var i = 0; i < tilesArray.length; i++) {
	    tilesArray[i].index = desiredIndex;
	  }
	},

    // Controlador de mute
    mute: function () {
      // altera volume de mute para audio normal
      this.game.sound.mute = !this.game.sound.mute;
    }

};