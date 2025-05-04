export default class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, hp){
        super(scene, x, y, "hero");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.countOfJump = 0;
        this.timeOfFly = 0;
        this.respawnTime = 0;
        this.reloadTime = 0;
        this.hpReload = 60;
        this.mana = 10000;

        this.level = 1;
        this.levelPoints = 0;

        this.timeOfBrake = 10;
        this.isDamaging = false;
        this.timeOfTint = 0;
        this.hp = hp;
        this.manaRegen = 300;
        this.isRight = true;
        this.setBounce(0);
        this.setCollideWorldBounds(true);

        this.setScale(1.5).refreshBody();

        this.createAnimations();
    }

    createAnimations(){
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("hero", {start: 16, end: 19}),
            frameRate: 10,
            repeat: -1  
        })
    
        this.anims.create({
            key: "turn",
            frames: this.anims.generateFrameNumbers("hero", {start: 0, end: 1}),
            frameRate: 2
        })
    
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("hero", {start: 24, end: 31}),
            frameRate: 10,
            repeat: -1
        })


    
        this.anims.create({
            key: "attack",
            frames: this.anims.generateFrameNumbers("hero", {start: 64, end: 71}),
            frameRate: 10,
        })

        this.anims.create({
            key: "death",
            frames: this.anims.generateFrameNumbers("hero", {start: 55, end: 63}),
            frameRate: 10,
        })
    }

    update(cursors, a_key, d_key, justDownSpace){
        if(this.timeOfFly == 0){
            if(this.body.blocked.down){
                this.countOfJump = 0
            }
            if(justDownSpace && this.countOfJump < 2)
            {
                this.countOfJump++
                this.setVelocityY(-500)
            }
        }
        else if(this.timeOfFly != 0){
            this.timeOfFly--
            if(cursors.space.isDown){
                this.setVelocityY(-500)
            }
        }
    
        if(cursors.left.isDown || a_key.isDown)
        {
            if(cursors.shift.isDown){
                this.speed = 1.5
                this.setVelocityX(-200 * this.speed)
                this.anims.play("run", true)
            }else{
                this.speed = 1
                this.setVelocityX(-200 * this.speed)
                this.anims.play("walk", true)
            }
            this.setFlipX(true)
            this.isRight = false
        }
        else if(cursors.right.isDown || d_key.isDown)
        {
            if(cursors.shift.isDown){
                this.speed = 1.5
                this.setVelocityX(200 * this.speed)
                this.anims.play("run", true)
            }else{
                this.speed = 1
                this.setVelocityX(200 * this.speed)
                this.anims.play("walk", true)
            }
            this.setFlipX(false)
            this.isRight = true
        }
        else
        {
            this.setVelocityX(0)
            this.anims.play("turn", true)
        }


        if(this.isDamaging){
            this.setTint(0xff0000);
            this.timeOfTint = 60;
            this.isDamaging = false;
        }
        else{
            if(this.timeOfTint <= 0){
                this.clearTint();
            }
            else{
                this.timeOfTint--;
            }
        }
    }
}