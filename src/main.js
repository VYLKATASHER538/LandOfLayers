import { Game } from './scenes/Game';
import { ManualScene } from './scenes/Manual';
import MainMenu from './scenes/MainMenu';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    physics: {
        default: "arcade",
        arcade: {
            gravity: {   y : 1000   },
            debug: false
        }
    },
    scene : [ MainMenu, ManualScene, Game ],
    fps: 60,
    pixelArt: true,
};

export default new Phaser.Game(config);
