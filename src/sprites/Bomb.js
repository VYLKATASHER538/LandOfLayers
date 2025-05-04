export class Bomb extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, "bomb");
    }

    fire(){
        this.setActive(true);
        this.setVisible(true);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.setBounce(1)
        this.setCollideWorldBounds(true)
        this.setVelocity(Phaser.Math.Between(-200, 200), 20)
    }
}

export class Bombs extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
    }
}