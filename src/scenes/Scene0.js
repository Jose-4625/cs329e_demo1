/*global Phaser*/
export default class Scene0 extends Phaser.Scene {
  constructor () {
    super('Scene0');
  }

  init (data) {
    // Initialization code goes here
    try{
      this.score = data.score;
    }
    catch{
      console.log('score initialized');
      this.score = 0;
    }

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
    this.load.image('desert', "./assets/images/background.png");
    this.load.image('red', './assets/sprites/redBall.png');
    this.load.image('star','./assets/sprites/star.png')
    this.load.image('bomb', './assets/sprites/bomb.png')



    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }


  create (data) {


    //add background
    var background = this.add.sprite(1280 / 2 , 960 / 2,'desert');
    //add platforms
    var platforms;

    this.scoreText;
    this.stars;
    this.bombs;
    platforms = this.physics.add.staticGroup();
    platforms.create(20, 900, "ground").refreshBody();
    platforms.create(600, 800, "ground");
    platforms.create(80, 700, "ground");
    platforms.create(600, 600, "ground");
    platforms.create(1000, 500, "ground");



    //add player sprite
    this.player = this.physics.add.sprite(100, 800, 'alien');
    this.player.setTint(0xffee00)
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
    var particles = this.physics.add.sprite(1150,450,'red');
    particles.body.setAllowGravity(false);
    this.physics.add.collider(this.player, particles);
    var particles1 = this.add.particles('red');
    this.emitter = particles1.createEmitter({
      lifespan: 2000,
      speedX: {min:0, max: 500},
      speedY: {min:-400, max: 0},
      scale: {start:1, end:0},
      blendMode:"MULTIPLY"
    });
    this.emitter.setPosition(1150, 450);
    this.emitter.setGravityY(-8000);
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(function(child) {
      //  Give each star a slightly different bounce
      child.setBounce(1,1);
      child.setCollideWorldBounds(true);
      child.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
    });

    this.bombs = this.physics.add.group();

    //add scene change portal
    this.physics.add.collider(
      this.player,
      particles,
      function(){
        this.scene.start('Scene1', {score: this.score});
      },
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
    this.portalText = this.add.text(900, 525, "Portal to next \n scene", {
      fontSize: "40px",
      fill: "#000"
    });
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(this.bombs, platforms);



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
  var x =
    player.x < 400
      ? Phaser.Math.Between(400, 800)
      : Phaser.Math.Between(0, 400);

  this.bomb = this.bombs.create(x, 16, "bomb");
  this.bomb.setBounce(1);
  this.bomb.setCollideWorldBounds(true);
  this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  this.bomb.allowGravity = false;
  if (this.stars.countActive(true) === 0) {
    //  A new batch of stars to collect
    this.stars.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true, true);
      child.setVelocity(Phaser.Math.Between(-200, 200), 20);
    });

  }
}
hitBomb(player, bomb) {
  player.setTint(0xff0000);
  player.setVelocityX(0);
  bomb.disableBody(true, true);
  this.score -= 20;
  this.scoreText.setText("Score: " + this.score);
  setTimeout(() => {
    this.player.setTint(0xffee00);
  }, 2000);


}

}
