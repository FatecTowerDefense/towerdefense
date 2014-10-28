/*globals game, tileSize, towers, money:true, monsters, tilePath, Bullet  */
var Tower = function (xTile, yTile, sprite, damage, range, fireRate, health, imortal, bulletSpeed, price, bulletSprite) {
  // Adiciona a sprite da torre
  this.tower = game.add.sprite(xTile - (xTile % tileSize), yTile - (yTile % tileSize), sprite);
  // Salva tile em que está
  this.tower.xTile = (xTile - (xTile % tileSize)) / tileSize;
  this.tower.yTile = (yTile - (yTile % tileSize)) / tileSize;
  // Dano que a torre causa
  this.tower.damage = damage;
  // Area que a torre atingre
  this.tower.range = range;
  // Vida da torre
  this.tower.health = health;
  // Tempo entre os tiros
  this.tower.fireRate = fireRate;
  this.tower.lastShot = game.time.now;
  // recebe velocidade do tiro
  this.tower.bulletSpeed = bulletSpeed;
  // recebe sprite do tiro
  this.tower.bulletSprite = bulletSprite;
  // Adiciona a torre no grupo de torres
  towers.add(this.tower);
  // Se a torre pode ser atingida
  this.tower.imortal = imortal;
  this.tower.upgrade = 0;
  // Substrai o valor da torre
  money -= price;
};

Tower.prototype.attack = function (tower) {
  if (game.time.now > tower.lastShot) {
    // TODO - Atirar
    var targets = [];
    monsters.forEach(function (monster) {
      if (Math.abs(tilePath[monster.tile].y - tower.yTile) < tower.range && Math.abs(tilePath[monster.tile].x - tower.xTile) < tower.range) {
        targets.push(monster); // lista todos os alvos no range
      }
    });
    // TODO - AI da Torre para escolher qual alvo atirar - hoje atiro no primeiro dentro de range
    if (targets.length > 0) {
      Tower.prototype.fire(tower, targets[0]);
    }
    tower.lastShot = game.time.now + tower.fireRate;
  }
};

Tower.prototype.fire = function (tower, monster) {
  //Bullet = function (startX, startY, destX, destY, speed, damage, shooter, sprite)
  new Bullet(tower.x, tower.y, monster.x, monster.y, tower.bulletSpeed, tower.damage, tower, tower.bulletSprite);
};

Tower.prototype.damageTaken = function (tower, monster) {
  tower.health -= monster.damage;
  if (tower.health <= 0 && tower.imortal === false) {
    Tower.prototype.death(this);
  }
};

Tower.prototype.death = function (tower) {
  // TODO
  console.log('tower destroyed' + tower);
};
