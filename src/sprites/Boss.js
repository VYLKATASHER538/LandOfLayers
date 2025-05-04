export class Boss extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, player, spriteSheet){
        super(scene, x, y);
        this.scene = scene;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setBounce(0);
        this.setScale(5.9);

        this.damage = 35;
        this.reloadingTime = 0;
        this.hp = 50;
        this.dist = 50;
        this.player = player;
        this.spriteSheet = spriteSheet;
        this.isRight = false;
        this.isJumpAttack = false;
        this.isRun = false;
        this.reloadTime = 300;

        this.createAnimations();    
    }
    update(){
        if(this.hp > 0){
            if(this.body.position.x >= this.player.body.position.x + this.dist || this.x >= 1000*32){
                this.isRight = false;
            }
            if(this.body.position.x <= this.player.body.position.x - this.body.width || this.x <= 0){
                this.isRight = true;
            }
    
            if(this.isRight){
                if(this.isRun){
                    this.setVelocityX(500)
                }
                else{
                    this.setVelocityX(100)
                }
                this.anims.play("walk_boss", true)
                this.setFlipX(false)
            }
            else{
                if(this.isRun){
                    this.setVelocityX(-500)
                }
                else{
                    this.setVelocityX(-100)
                }
                this.anims.play("walk_boss", true)
                this.setFlipX(true)
            }


            if(this.body.blocked.down && this.reloadTime > 0){
                this.isRun = false
            }
            if(this.isJumpAttack){
                this.isRun = true
                this.setVelocityY(-800)
                this.reloadTime = 300
                this.isJumpAttack = false
            }
            if(this.reloadTime <= 0){
                this.isJumpAttack = true
            }
            if(this.reloadTime > 0){
                this.reloadTime--
            }

            
            if(this.body.blocked.right && this.body.blocked.down){
                this.setVelocityY(-600)
            }
            if(this.body.blocked.left && this.body.blocked.down){
                this.setVelocityY(-600)
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
            key: "walk_boss",
            frames: this.anims.generateFrameNumbers(this.spriteSheet, {start: 6, end: 9}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: "dead",
            frames: this.anims.generateFrameNumbers(this.spriteSheet, {start: 24, end: 29}),
            frameRate: 10,
        })
    }
}
export class Bosses extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
    }
}