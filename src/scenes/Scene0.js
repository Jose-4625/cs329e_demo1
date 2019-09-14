/*global Phaser*/
export default class Scene0 extends Phaser.Scene {
  constructor () {
    super('Scene0');
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
    this.load.spritesheet("dude", "./assets/sprites/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.image("ground", "./assets/sprites/platform.png");

    //load background
    this.load.image('desert', "./assets/images/background.png")



    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }


  create (data) {


    //add background
    var background = this.add.sprite(1280 / 2 , 960 / 2,'desert');
    //add platforms
    var platforms;
    this.score = 0;
    this.scoreText;
    platforms = this.physics.add.staticGroup();
    platforms.create(20, 900, "ground").refreshBody();
    platforms.create(600, 800, "ground");
    platforms.create(80, 700, "ground");
    platforms.create(600, 600, "ground");
    platforms.create(1000, 500, "ground");



    //add player sprite
    this.player = this.physics.add.sprite(100, 800, 'alien');
    this.player.setTint(0xff2d00)
    this.player.setScale(0.4);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 1280, 960);

    this.cameras.main.setBounds(0, 0, 1280, 960);
    this.cameras.main.startFollow(this.player);
    this.physics.add.collider(this.player, platforms);

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
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000"
    });
    this.scoreText.setScrollFactor(0);

    }

  update (time, delta) {
    // Update the scene
    var cursors = this.input.keyboard.createCursorKeys();
    var speed = 4.5;
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
  collectStar(player, star) {
  star.disableBody(true, true);

  //  Add and update the score
  this.score += 10;
  this.scoreText.setText("Score: " + this.score);

  if (this.stars.countActive(true) === 0) {
    //  A new batch of stars to collect
    this.stars.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    this.bomb = this.bombs.create(x, 16, "bomb");
    this.bomb.setBounce(1);
    this.bomb.setCollideWorldBounds(true);
    this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    this.bomb.allowGravity = false;
  }
}
}
