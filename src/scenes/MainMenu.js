import { Scene } from 'phaser';
import LevelGenerator from '../classes/LevelGenerator';

export default class MainMenu extends Scene
{
    constructor(){
        super("MenuScene")
    }
    preload(){
        this.load.image("poster", "assets/logos/Poster.png")
        this.load.image("sky", "assets/background/sky.png")
        this.load.image("tilesNew", "assets/tilesets/world_tileset.png")
        this.load.image("logo", "assets/logos/logo.png")

        this.load.audio("menuMusic", "assets/Music/menuMusic.wav")
    }
    create(){
        const {centerX, centerY} = this.cameras.main
        this.sky = this.add.image(centerX, centerY, "sky").setScale(20, 3)

        this.level = new LevelGenerator(this, "tilesNew", "tilesNew", -1000)

        this.menuMusic = this.sound.add('menuMusic');
        this.menuMusic.loop = true;
        this.menuMusic.play();

        const menu = this.add.container(centerX, centerY)
        this.play = this.add.text(0, -100, "Play", {fontSize: 64, fill: "#000", fontStyle: "bold"}).setAlign("center").setScrollFactor(0).setOrigin(0.5, 1)
        this.manual = this.add.text(0, 0, "How to play", {fontSize: 64, fill: "#000", fontStyle: "bold"}).setAlign("center").setScrollFactor(0).setOrigin(0.5, 1)
        this.logo = this.add.image(0, -300, "logo").setScale(0.15)
        menu.add(this.play)
        menu.add(this.manual)
        menu.add(this.logo)
        this.play.setInteractive()
        this.play.on("pointerdown", () => {
            this.menuMusic.stop();
            this.scene.start("Game")
        })
        this.manual.setInteractive()
        this.manual.on("pointerdown", () => {
            this.menuMusic.stop();
            this.scene.start("ManualScene")
        })
    }
}
