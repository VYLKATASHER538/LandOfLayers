export class Explosion extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, spriteSheet){
        super(scene, x, y);
        this.scene = scene;
        this.spriteSheet = spriteSheet;

        this.createAnimations();
    }

    createAnimations(){
        this.anims.create({
            key: "explosionAnim",
            frames: this.anims.generateFrameNumbers(this.spriteSheet, {start: 2, end: 15}),
            frameRate: 25
        })
    }

    fire(){
        this.setActive(true);
        this.setVisible(true);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(true);
        this.setGravityY(-1000);

        this.anims.play("explosionAnim", true);
    }
}

export class Explosions extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
    }
}