/*global Phaser*/
export default class Scene1 extends Phaser.Scene {
  constructor () {
    super('Scene1');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.spritesheet('alien', "./assets/spriteSheets/player.png", {
      frameHeight: 92,
      frameWidth: 67
    });

    //load background
    this.load.image('desert', "./assets/images/background.png")

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //add background
    var background = this.add.sprite(1280 / 2 , 960 / 2,'desert');
    //add player sprite
    this.player = this.physics.add.sprite(50, 400, 'alien');
    this.player.setScale(0.5);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 1280, 960);

    this.cameras.main.setBounds(0, 0, 1280, 960);
    this.cameras.main.startFollow(this.player);
    //Create animation from sprite sheet
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers('alien', { start: 0, end: 5}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('alien', { start: 0, end: 0}),
      frameRate: 10,
      repeat: -1
    });
    }

  update (time, delta) {
    // Update the scene
    var cursors = this.input.keyboard.createCursorKeys();
    var speed = 5;
    if (cursors.left.isDown){
      this.player.x -= speed;
      this.player.flipX = true;
      this.player.anims.play('walk', true);
    } else if( cursors.right.isDown){
      this.player.x += speed;
      this.player.flipX = false;
      this.player.anims.play('walk', true);
    } else{
      this.player.anims.play('idle', true);
    }
    if (cursors.up.isDown){
      this.player.y -= speed;
    } else if (cursors.down.isDown){
      this.player.y += speed;
    }
  }
}
