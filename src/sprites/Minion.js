export class Minion extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, isRight, player, spriteSheet){
        super(scene, x, y);
        this.scene = scene;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setBounce(0);
        this.setScale(1.9);

        this.player = player;
        this.spriteSheet = spriteSheet
        this.isRight = isRight;
        this.dist = 100;

        this.createAnimations();    
    }
    update(){
        if(this.body.position.x >= this.player.body.position.x + this.dist || this.x >= 1000*32){
            this.isRight = false;
        }
        if(this.body.position.x <= this.player.body.position.x - this.dist || this.x <= 0){
            this.isRight = true;
        }


        if(this.isRight){
            this.setVelocityX(200)
            this.anims.play("walk_minion", true)
            this.setFlipX(false)
        }
        else{
            this.setVelocityX(-200)
            this.anims.play("walk_minion", true)
            this.setFlipX(true)
        }

        
        if(this.body.blocked.right && this.body.blocked.down){
            this.setVelocityY(-600)
        }
        if(this.body.blocked.left && this.body.blocked.down){
            this.setVelocityY(-600)
        }
    }
    createAnimations(){
        this.anims.create({
            key: "walk_minion",
            frames: this.anims.generateFrameNumbers(this.spriteSheet, {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1  
        })
    }
}

export class Minions extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
    }
}