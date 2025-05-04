import { Scene } from 'phaser';

export class ManualScene extends Scene{
    constructor(){
            super("ManualScene")
        }
    preload(){
        this.load.image("sky", "assets/background/sky.png")
        this.load.image("logo", "assets/logos/logo.png")

        this.load.audio("guideMusic", "assets/Music/guideMusic.wav")
    }
    create(){
        const {centerX, centerY} = this.cameras.main
        this.sky = this.add.image(centerX, centerY, "sky").setScale(20, 3)

        this.guideMusic = this.sound.add('guideMusic');
        this.guideMusic.loop = true;
        this.guideMusic.play();

        const menu = this.add.container(centerX, centerY)
        this.manual = this.add.text(0, 50, "W A S D Space - move player \n Left click - use item \n Numbers or Mouse wheel - select item", {fontSize: 64, fill: "#000", fontStyle: "bold"}).setAlign("center").setScrollFactor(0).setOrigin(0.5, 1)
        this.exit = this.add.text(0, 0, "X", {fontSize: 84, fill: "#000", fontStyle: "bold"}).setScrollFactor(0)
        menu.add(this.manual)

        this.exit.setInteractive()
        this.exit.on("pointerdown", () => {
            this.guideMusic.stop();
            this.scene.start("MenuScene")
        })
    }
}