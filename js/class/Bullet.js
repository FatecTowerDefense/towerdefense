/*globals game, bullets */
var Bullet = function (startX, startY, destX, destY, speed, damage, shooter, sprite) {
	this.bullet = game.add.sprite(startX, startY, sprite);
	this.bullet.startX = startX;
	this.bullet.startY = startY;
	this.bullet.destX = destX;
	this.bullet.destY = destY;
	this.bullet.speed = speed;
	this.bullet.damage = damage;
	this.bullet.shooter = shooter;
	// Adiciona a bala no grupo de balas
	bullets.add(this.bullet);
	Bullet.prototype.setVelocVector(this.bullet);
};

Bullet.prototype.setVelocVector = function (bullet) {
	//o phaser comeca a deslocar o objeto com veloc constante
	
	//normaliza
	var distX = bullet.destX - bullet.startX, distY = bullet.destY - bullet.startY;
	
	//faz a bala rodar ao redor de seu centro, e nao do canto superior esquerdo
	bullet.anchor.setTo(0.5, 0.5);
	//aponta para o destino
	bullet.rotation = game.physics.arcade.angleToXY(bullet, bullet.destX, bullet.destY);
	
	
	if (Math.abs(distX) > Math.abs(distY)) {
		bullet.body.velocity.set(distX / Math.abs(distX) * bullet.speed, distY / Math.abs(distX) * bullet.speed);
	} else {
		bullet.body.velocity.set(distX / Math.abs(distY) * bullet.speed, distY / Math.abs(distY) * bullet.speed);
	}
};