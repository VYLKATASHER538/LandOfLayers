export class Bullet extends Phaser.Physics.Arcade.Sprite{
    velocityFromRotation = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation;
    SPEED = 1000;
    constructor(scene, x, y, distance, target){
        super(scene, x, y, "fireball");
        this.damage = 20;
        this.target = target;
        this.startX = x;
        this.distance = distance;
        // this.worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);
        this.angleToPointer = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        this.rotation = this.angleToPointer;
    }

    update(){
        this.velocityFromRotation(this.rotation, this.SPEED, this.body.velocity)

        if(this.body.position.x >= this.startX + this.distance || this.body.position.x <= this.startX - this.distance){
            this.disableBody(true, true)
        }
    }

    shoot(player){
        this.setActive(true);
        this.setVisible(true);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
    }
}

export class Bullets extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
    }
}