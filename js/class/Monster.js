/*globals game, tileSize, monsters, tilePath, waveMonsters:true, score:true, money:true */
var Monster = function (xTile, yTile, sprite, spriteLength, speed, damage, health) {
  // TODO - definir velocidade - dano e vida de acordo com a sprite enviada, ou trocar sprite
  // pelo nome do monstro e pegar os dados de uma lista global

  // Adiciona sprite na posicao
  this.monster = game.add.sprite(xTile * tileSize, yTile * tileSize, sprite);
  this.monster.scale.set(1);
  this.monster.xTile = xTile;
  this.monster.yTile = yTile;
  // Adiciona animacao de andar em relacao ao sprite adicionado
  this.monster.animations.add('run');
  this.monster.animations.play('run', spriteLength * 4, true);
  // ancora no centro de cada sprite
  this.monster.anchor.setTo(0.5, 0.5);
  // define a vida do monstro
  this.monster.health = health; // vida atual do monstro
  this.monster.totalHealth = health; // vida maxima do monstro
  // Controle de velocidade global, x e y
  this.monster.speedX = 0;
  this.monster.speedY = 0;
  this.monster.speed = speed;
  // Recebe o dano que o monstro causara nas barreiras
  this.monster.damage = damage;
  // Tile em que o monstro esta
  this.monster.tile = -1;
  // Adiciona o monstro no grupo de monstros
  monsters.add(this.monster);

  // Desenha um retângulo cheio sobre cada personagem
  this.monster.lifeBar = game.add.graphics(0, 0); // inicia o retangulo
  this.monster.lifeBar.lineStyle(2, 0x000000, 1); // largura, cor, alfa
  this.monster.lifeBar.beginFill(0xFFFF00, 0.8); // cor, alfa
  this.monster.lifeBar.drawRect(this.monster.x - this.monster.width / 2, this.monster.y - this.monster.height / 2, this.monster.width, 5); // x, y, largura, altura

  // Desenha um retângulo de vida sobre cada personagem
  this.monster.lifeBarStatus = game.add.graphics(0, 0); // inicia o retangulo
  this.monster.lifeBarStatus.lineStyle(2, 0x000000, 0); // largura, cor, alfa
  this.monster.lifeBarStatus.beginFill(0x00FF00, 0.9); // cor, alfa
  this.monster.lifeBarStatus.drawRect(this.monster.x - this.monster.width / 2, this.monster.y - this.monster.height / 2, this.monster.width, 5); // x, y, largura, altura

  // Inicia movimentacao
  Monster.prototype.nextMove(this.monster);
  Monster.prototype.move(this.monster);

};

Monster.prototype.move = function (monster) {
  // TODO
  monster.x += monster.speedX;
  monster.y += monster.speedY;

  if (monster.speedX > 0 && monster.x >= monster.nextPosX) {
    monster.x = monster.nextPosX;
    Monster.prototype.nextMove(monster);
  } else if (monster.speedX < 0 && monster.x <= monster.nextPosX) {
    monster.x = monster.nextPosX;
    Monster.prototype.nextMove(monster);
  } else if (monster.speedY > 0 && monster.y >= monster.nextPosY) {
    monster.y = monster.nextPosY;
    Monster.prototype.nextMove(monster);
  } else if (monster.speedY < 0 && monster.y <= monster.nextPosY) {
    monster.y = monster.nextPosY;
    Monster.prototype.nextMove(monster);
  }

  // Atualiza a barra de vida
  monster.lifeBar.x = monster.x - monster.width;
  monster.lifeBar.y = monster.y - monster.height / 2;
  // Atualiza posicao da barra de vida atual
  monster.lifeBarStatus.x = monster.x - monster.width;
  monster.lifeBarStatus.y = monster.y - monster.height / 2;
  // Calcula o dano tomado - escala e posiciona a barra de vida atual
  var damTaken = monster.health / monster.totalHealth;
  monster.lifeBarStatus.scale.x = damTaken;
  monster.lifeBarStatus.x += (1 - (monster.health / monster.totalHealth)) * monster.width / 2;

};

Monster.prototype.nextMove = function (monster) {
  if (monster.tile < tilePath.length - 1) {
    monster.tile++;
  }
  monster.nextPosX = parseInt(tilePath[monster.tile].x * tileSize, 10);
  monster.nextPosY = parseInt(tilePath[monster.tile].y * tileSize, 10);
  if (monster.nextPosX > monster.x) {
    monster.speedX = monster.speed;
    monster.angle = 0;
  } else if (monster.nextPosX < monster.x) {
    monster.speedX = -monster.speed;
    monster.angle = 180;
  } else {
    monster.speedX = 0;
  }
  if (monster.nextPosY > monster.y) {
    monster.speedY = monster.speed;
    monster.angle = 90;
  } else if (monster.nextPosY < monster.y) {
    monster.speedY = -monster.speed;
    monster.angle = -90;
  } else {
    monster.speedY = 0;
  }
};

Monster.prototype.death = function (monster) {
  if (monster.health <= 0) {
    // destroi a sprite de monstro
    monsters.remove(monster);
    monster.destroy();
    // remove a barra de vida do monstro
    monster.lifeBarStatus.destroy();
    monster.lifeBar.destroy();
    waveMonsters--;
  }
  score += 5;
  money += 25;
};