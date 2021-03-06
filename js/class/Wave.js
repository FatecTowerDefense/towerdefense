/*globals game, waveMonsters:true, Monster, monstersBlock:true, tilePath, monsterProps, waveStartTime:true */
var Wave = function (monsterSprite, timeToStart, timeBetween, points) {
  // Recebe as variaveis
  // cria a wave como sprite para receber as propriedades - verificar como gerar objeto generico
  this.wave = game.add.sprite(-100, -100, 'corposeco');
  this.wave.monsterSprite = monsterSprite;
  // Verifica quantidade diferentes de monstros
  this.wave.monstersType = monsterSprite.length;
  // define o tempo ate o inicio da onda
  this.wave.timeToStart = timeToStart;
  // define o tempo entre os monstros
  this.wave.timeBetween = timeBetween;
  // define os pontos que receberá caso ganhe a onda
  this.wave.points = points;
  // Verifica a quantidade total de monstros
  var i = 0;
  this.wave.waveLenght = 0;
  while (i <= this.wave.monstersType - 1) {
    this.wave.waveLenght += this.wave.monsterSprite[i].amount;
    i++;
  }
  // Define a quantidade total de monstros de forma global
  waveMonsters = this.wave.waveLenght;
  // inicia a onda
  Wave.prototype.count(this.wave);
  //this.wave.begin(this.wave);
};

Wave.prototype.count = function (wave) {
  if (typeof waveStartTime != 'undefined') {
    clearTimeout(waveStartTime);
  }
  waveStartTime = setTimeout(function () {
    Wave.prototype.begin(wave);
  }, wave.timeToStart);
};

Wave.prototype.begin = function (wave) {
  var i = 0;
  var j = 0;
  monstersBlock = setInterval(function () {
    var velo, dano, vida, animations;
    
    // Para cada tipo de monstro
    if (j < wave.monstersType) {
      
      switch(wave.monsterSprite[j].sprite){
        case 'curupira':
          velo = monsterProps.curupiraProps.velocidade;
          dano = monsterProps.curupiraProps.dano;
          vida = monsterProps.curupiraProps.vida;
          animations = monsterProps.curupiraProps.animations;
          break;
        
        case 'corposeco':
          velo = monsterProps.corpoSecoProps.velocidade;
          dano = monsterProps.corpoSecoProps.dano;
          vida = monsterProps.corpoSecoProps.vida;
          animations = monsterProps.corpoSecoProps.animations;
          break;
          
        case 'saci':
          velo = monsterProps.saciProps.velocidade;
          dano = monsterProps.saciProps.dano;
          vida = monsterProps.saciProps.vida;
          animations = monsterProps.saciProps.animations;
          break;
          
        case 'mula':
          velo = monsterProps.mulaProps.velocidade;
          dano = monsterProps.mulaProps.dano;
          vida = monsterProps.mulaProps.vida;
          animations = monsterProps.mulaProps.animations;
          break;
          
        default:
          console.log('que sprite eh essa??');
          break;
      }
      
      // Para cada um dentro da quantidade definida em amount
      if (i < wave.monsterSprite[j].amount) {
        // Cria o monstro com o sprite especifico
        new Monster(tilePath[0].x, tilePath[0].y, wave.monsterSprite[j].sprite, 1, velo, dano, vida, animations); // xTile, yTile, sprite, spriteLength, speed, damage, health, animations
        i++;
      } else {
        j++;
        i = 0;
      }
    } else {
      clearTimeout(monstersBlock);
    }
  }, wave.timeBetween);
};
