export class Mob extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, player, spriteSheet){
        super(scene, x, y);
        this.scene = scene;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setBounce(0);
        this.setScale(1.9);

        this.damage = 20;
        this.reloadingTime = 0;
        this.reloadingShootTime = 300;
        this.hp = 1;
        this.dist = 1000;
        this.player = player;
        this.spriteSheet = spriteSheet;
        this.isRight = false;
        this.visiblePlayer = false;
        this.start_x = this.body.position.x;

        this.createAnimations();    
    }
    update(){
        if(this.hp > 0){
            if(this.visiblePlayer = false){
                if(this.body.position.x >= this.start_x + this.dist || this.x >= 1000*32){
                    this.isRight = false;
                }
                if(this.body.position.x <= this.start_x - this.dist || this.x <= 0){
                    this.isRight = true;
                }
            }
    
    
    
            if(this.isRight){
                this.setVelocityX(100)
                this.anims.play("walk_enemy", true)
                this.setFlipX(false)
            }
            else{
                this.setVelocityX(-100)
                this.anims.play("walk_enemy", true)
                this.setFlipX(true)
            }
    
    
            
            if(this.body.blocked.right && this.body.blocked.down){
                this.setVelocityY(-600)
            }
            if(this.body.blocked.left && this.body.blocked.down){
                this.setVelocityY(-600)
            }
    
    
    
    
            if(this.body.position.x - this.player.body.position.x <= 500 && this.body.position.x - this.player.body.position.x > 50 && this.player.body.position.y - this.body.position.y <= 250){
                this.isRight = false
                this.visiblePlayer = true
            }
            else if(this.body.position.x - this.player.body.position.x >= -500 && this.body.position.x - this.player.body.position.x < -50 && this.player.body.position.y - this.body.position.y <= 250){
                this.isRight = true
                this.visiblePlayer = true
            }
            else{
                this.visiblePlayer = false
            }
    
    
    
    
            if(this.body.blocked.down && this.body.position.y - this.player.body.position.y > 100 && this.visiblePlayer){
                this.setVelocityY(-600)
            }
        }

        if(this.reloadingTime > 0){
            this.reloadingTime--;
        }
    }
    createAnimations(){
        this.anims.create({
            key: "walk_enemy",
            frames: this.anims.generateFrameNumbers(this.spriteSheet, {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1  
        })
        this.anims.create({
            key: "dead",
            frames: this.anims.generateFrameNumbers(this.spriteSheet, {start: 25, end: 29}),
            frameRate: 10
        })
    }
}

export class Mobs extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
    }
}