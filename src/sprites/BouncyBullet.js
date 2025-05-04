export class BouncyBullet extends Phaser.Physics.Arcade.Sprite{
    velocityFromRotation = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation;
    SPEED = 500;
    constructor(scene, x, y, distance){
        super(scene, x, y, "bouncyBall");
        this.target = 0;
        this.startX = x
        this.distance = distance
        this.worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);
        this.angleToPointer = Phaser.Math.Angle.Between(this.x, this.y, this.worldPoint.x, this.worldPoint.y)
        this.rotation = this.angleToPointer
        this.start = true;
    }

    update(){
        if(this.start){
            this.velocityFromRotation(this.rotation, this.SPEED, this.body.velocity)
            this.start = false
        }

        if(this.body.position.x >= this.startX + this.distance || this.body.position.x <= this.startX - this.distance){
            this.disableBody(true, true)
        }
    }

    shoot(player){
        this.setBounce(1)
        this.setActive(true);
        this.setVisible(true);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
    }
}

export class BouncyBullets extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
    }
}