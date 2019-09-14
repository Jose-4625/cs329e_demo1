/*global Phaser, window*/
import Scene0 from './scenes/Scene0.js';
import Scene1 from './scenes/Scene1.js';


import Config from './config/config.js';


class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Scene0', Scene0);
    this.scene.add('Scene0', Scene1);

    this.scene.start('Scene0');
  }
}

window.game = new Game();
