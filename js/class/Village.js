/*globals game, tilePath, tileSize, villages, monstersBlock, bgMusic  */
var Village = function (sprite, health) {
  // verifica o ponto final do caminho
  var xTile = tilePath[tilePath.length - 2].x;
  var yTile = tilePath[tilePath.length - 2].y;
  // Adiciona a sprite
  this.village = game.add.sprite((xTile - 1) * tileSize, (yTile - 1) * tileSize, sprite);
  // Vida da cidade
  this.village.health = health;
  this.village.totalHealth = health;
  // Adiciona o monstro no grupo de monstros
  villages.add(this.village);

  // Desenha um retângulo cheio sobre a vila
  this.village.lifeBar = game.add.graphics(0, 0); // inicia o retangulo
  this.village.lifeBar.lineStyle(2, 0x000000, 1); // largura, cor, alfa
  this.village.lifeBar.beginFill(0x00FF00, 0.8); // cor, alfa
  this.village.lifeBar.drawRect(this.village.x - 30, this.village.y + this.village.height, this.village.width, 5); // x, y, largura, altura



};

Village.prototype.damageTaken = function (village, monster) {
  var sfxDamage = game.add.audio('baseAttacked');
  sfxDamage.play();
  village.health -= monster.damage;
  monster.kill();
  monster.lifeBarStatus.destroy();
  monster.lifeBar.destroy();

  // Calcula o dano tomado - escala e posiciona a barra de vida atual
  var damTaken = village.health / village.totalHealth;
  var largura = village.width * (1 - damTaken);
  
  // Desenha um retângulo de vida tomada sobre a vila
  village.lifeBarStatus = game.add.graphics(0, 0); // inicia o retangulo
  village.lifeBarStatus.lineStyle(2, 0x000000, 0); // largura, cor, alfa
  village.lifeBarStatus.beginFill(0xFFFF00, 0.9); // cor, alfa
  village.lifeBarStatus.drawRect(village.x - 30, village.y + village.height, largura, 5); // x, y, largura, altura
  village.lifeBarStatus.enableBody = true;

  if (village.health <= 0) {
    Village.prototype.death(village);
  }
};

Village.prototype.death = function (village) {
  if (village.health <= 0) {
    village.lifeBar.destroy();
    village.lifeBarStatus.destroy();
    village.kill();
    // limpa a tela
    game.world.removeAll();
    clearTimeout(monstersBlock);

    // Cria textos de perda
    // coloca fundo e placa
    game.add.sprite(100, 100, 'aldeiaDestruida');
    game.add.sprite(100, 100, 'aldeiaDestruidaPlaca');
    var styleDeath = { font: "28px Arial", fill: "#FF0000", align: "center" };
    game.add.text(200, 250, "Sua vila foi destrúida!", styleDeath);
    var sfxGameOver = game.add.audio('gameover');
    sfxGameOver.play();
    if (bgMusic.isPlaying) {
     bgMusic.stop(); 
    }
    

    // espera 5 segundos e joga para o menu
    /*setTimeout(function () {
      if (sfxGameOver.isPlaying)
        sfxGameOver.stop();
      this.game.state.start('menu');
    }, 5000);*/

  }
};
