var boot_state = {

  preload: function () {

    this.load.image('preloader', '../../assets/sprites/loading.gif');

  },

  create: function () {

    this.game.state.start('preload');

  },

};
