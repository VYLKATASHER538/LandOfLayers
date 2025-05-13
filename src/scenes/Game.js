import { Scene } from 'phaser';
import Player from '../sprites/Player';
import LevelGenerator from '../classes/LevelGenerator';
import {Mob, Mobs} from '../sprites/Mob';
import {Bomb, Bombs} from '../sprites/Bomb';
import {Minion, Minions} from '../sprites/Minion';
import {Bullet, Bullets} from '../sprites/Bullet';
import {BouncyBullet, BouncyBullets} from '../sprites/BouncyBullet';
import {Boss, Bosses} from '../sprites/Boss';
import {Explosion, Explosions} from '../sprites/Explosion';

export class Game extends Scene
{
    constructor(){
        super("Game")

        this.player;

        this.explosions;
        this.bosses;
        this.bombs;
        this.mobs;
        this.minions;
        this.bullets;
        this.mobBullets;
        this.bouncyBullets;

        this.cursors;
        this.a_key;
        this.d_key;

        this.endGame;
        this.button;

        this.gameover = false;
        this.bombChaos = false;
        this.bossChaos = false;

        this.bombChaosTime = 3600;
        this.bombChaosPretime = Phaser.Math.Between(36000, 72000);

        this.bossPretime = Phaser.Math.Between(18000, 36000);

        this.spawnRate;

        this.marker;
        this.objectToPlace;
        this.inventory = [];
        // this.count;

        this.manaCount;
        this.hpCount;
        this.reloadText;
    }
    
    preload(){
        this.load.image("sky", "assets/background/sky.png")
        this.load.image("star", "assets/star.png")
        this.load.image("bomb", "assets/enemies/bomb.png")
        this.load.image("button", "assets/button.png")
        this.load.image("Fan", "assets/Fan.png")
        this.load.image("bullet", "assets/bullet.png")
        this.load.image("fireball", "assets/fireballs/fireballs/FB001.png")
        this.load.image("bouncyBall", "assets/fireballs/fireballs/bouncyBall.png")

        this.load.spritesheet("zombie", "assets/enemies/LEVEL-3/LEVEL-3/MINION_9.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("spider", "assets/enemies/LEVEL-3/LEVEL-3/MINION_10.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("boss", "assets/enemies/LEVEL-3/LEVEL-3/Frankie.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("minion", "assets/enemies/LEVEL-1/LEVEL-1/MINION_1.png", {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet("explosion", "assets/explosions/NormExp.png", {frameWidth: 64, frameHeight: 64})

        this.load.spritesheet("hero", "assets/player/animations_hero.png", {frameWidth: 32, frameHeight: 32})

        // this.load.image("tilesNew", "assets/tilesets/world_tileset.png");
        // this.load.spritesheet("tileSheet", "assets/tilesets/world_tileset.png", {frameWidth: 16, frameHeight: 16})
        // this.load.spritesheet("example", "assets/tilesets/example.png", {frameWidth: 16, frameHeight: 16})
        this.load.spritesheet("example1", "assets/tilesets/example1.png", {frameWidth: 16, frameHeight: 16})

        this.load.audio("bgMusic", "assets/Music/backGroundMusic.wav")
        this.load.audio("bossMusic", "assets/Music/bossMusic.wav")
    }
        
    create(){
        this.input.mouse.disableContextMenu();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.a_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.d_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    
        let sky = this.add.image(0, 1000, "sky").setScale(1000, 5)
        
        this.level = new LevelGenerator(this, "tilesNew", "tilesNew", 200)

        this.marker = this.add.graphics();
        this.marker.lineStyle(2, 0x000000, 1);
        this.marker.strokeRect(0, 0, this.level.map.tileWidth * this.level.layer.scaleX, this.level.map.tileHeight * this.level.layer.scaleY);

        this.explosions = new Explosions(this)
        this.mobs = new Mobs(this)
        this.minions = new  Minions(this)
        this.bombs = new Bombs(this)
        this.bullets = new Bullets(this)
        this.mobBullets = new Bullets(this)
        this.bouncyBullets = new BouncyBullets(this)
        this.bosses = new Bosses(this)
    
        this.player = new Player(this, this.level.width*16, 1500, 100)
        this.hpCount = this.add.text(window.innerWidth - 300, 16, "Health: " + this.player.hp, {fontSize: "32px", fill: "#DC143C", fontStyle: "bold"}).setScrollFactor(0).setDepth(1)
        this.manaCount = this.add.text(window.innerWidth - 300, 64, "Mana: " + this.player.mana, {fontSize: "32px", fill: "#00FFFF", fontStyle: "bold"}).setScrollFactor(0).setDepth(1)
        this.reloadText = this.add.text(50, 80, "Reloading...", {fontSize: "12px", fill: "#ffffff", fontStyle: "bold"}).setScrollFactor(0).setVisible(false).setDepth(1)

        this.spawnRate = 0.005
        // 0.005

        // 0 - grass
        // 16 - dirt
        // 8 - stone
        // 55 - wood
        // 192 - water
        // 15 - air
        const inventory_label = {
            "tileSheet" : [156, 159, 174, 355, 251, 248, 185, 292, 167, 0, 16, 8, 55]
        };

        for(let g in inventory_label){
            this.objectToPlace = inventory_label[g][0]
        }

        let inx = 0
        for(let g in inventory_label){
            for(let i = 0; i < inventory_label[g].length; i++){
                const elem = this.add.image(35 * inx, 0, "example1", inventory_label[g][i]).setScale(2);
                this.inventory.push(elem)
                inx++
            }
        }

        this.cur_elem = this.add.graphics();
        this.cur_elem.lineStyle(1.5, 0xC0C0C0, 1);
        this.cur_elem.strokeRect(this.inventory[0].x - this.inventory[0].width / 2, this.inventory[0].y - this.inventory[0].height / 2, this.inventory[0].width, this.inventory[0].height).setScale(2);
        
        const inventory_container = this.add.container(50, 50).setScrollFactor(0).setDepth(1)
        inventory_container.add(this.cur_elem)

        for(let i = 0; i < this.inventory.length; i++){
            inventory_container.add(this.inventory[i])
        }

        this.input.keyboard.on('keydown-ONE', (event) =>
        {
            for(let g in inventory_label){
                this.inventorySwitch(inventory_label[g][0], 0)
            }
        });

        this.input.keyboard.on('keydown-TWO', (event) =>
        {
            for(let g in inventory_label){
                this.inventorySwitch(inventory_label[g][1], 1)
            }
        });

        this.input.keyboard.on('keydown-THREE', (event) =>
        {
            for(let g in inventory_label){
                this.inventorySwitch(inventory_label[g][2], 2)
            }
        });

        this.input.keyboard.on('keydown-FOUR', (event) =>
        {
            for(let g in inventory_label){
                this.inventorySwitch(inventory_label[g][3], 3)
            }
        });
    
        this.input.keyboard.on('keydown-FIVE', (event) =>
        {
            for(let g in inventory_label){
                this.inventorySwitch(inventory_label[g][4], 4)
            }
        });

        this.input.keyboard.on('keydown-SIX', (event) =>
        {
            for(let g in inventory_label){
                this.inventorySwitch(inventory_label[g][5], 5)
            }
        });

        this.input.keyboard.on('keydown-SEVEN', (event) =>
        {
            for(let g in inventory_label){
                this.inventorySwitch(inventory_label[g][6], 6)
            }
        });

        this.input.keyboard.on('keydown-EIGHT', (event) =>
        {
            for(let g in inventory_label){
                this.inventorySwitch(inventory_label[g][7], 7)
            }
        });

        this.input.keyboard.on('keydown-NINE', (event) =>
        {
            for(let g in inventory_label){
                this.inventorySwitch(inventory_label[g][8], 8)
            }
        });

        this.input.keyboard.on('keydown-ZERO', (event) =>
        {
            for(let g in inventory_label){
                this.inventorySwitch(inventory_label[g][9], 9)
            }
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) =>
        {
            let cur_pos = (this.cur_elem.x + (deltaY / Math.abs(deltaY) * 35) ) % (35 * inventory_label["tileSheet"].length)
            this.cur_elem.x = cur_pos >= 0 ? cur_pos : 35 * (inventory_label["tileSheet"].length - 1)
            for(let g in inventory_label){
                this.objectToPlace = inventory_label[g][this.cur_elem.x / 35]
            }
        });

        const camera = this.cameras.main;
    
        camera.setBounds(0, 0, this.level.width * 32, this.level.height * 32, true, true, true, false)
        this.physics.world.setBounds(0, 0, this.level.width * 32, this.level.height * 32, true, true, true, false)
    
        camera.startFollow(this.player);
        camera.setFollowOffset(0, 15);
        camera.setLerp(.05, .05)
        
        this.physics.add.collider(this.player, this.level.layer)
        this.physics.add.collider(this.mobs, this.level.layer)
        this.physics.add.collider(this.bombs, this.level.layer)
        this.physics.add.collider(this.minions, this.level.layer)
        this.physics.add.collider(this.bosses, this.level.layer)
        this.physics.add.collider(this.bullets, this.level.layer, this.bulletWithBlock, null, this)
        this.physics.add.collider(this.mobBullets, this.level.layer, this.bulletWithBlock, null, this)
        this.physics.add.collider(this.bouncyBullets, this.level.layer)

        this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this)
        this.physics.add.overlap(this.player, this.mobs, this.hitEnemy, null, this)
        this.physics.add.overlap(this.player, this.mobBullets, this.hitBomb, null, this)
        this.physics.add.overlap(this.player, this.bosses, this.hitEnemy, null, this)
        this.physics.add.overlap(this.mobs, this.bullets, this.hitBullet, null, this)
        this.physics.add.overlap(this.bombs, this.bullets, this.hitBullet, null, this)
        this.physics.add.overlap(this.bosses, this.bullets, this.hitBullet, null, this)
        this.physics.add.overlap(this.mobs, this.minions, this.hitBullet, null, this)
        this.physics.add.overlap(this.bosses, this.minions, this.hitBullet, null, this)

        this.physics.add.overlap(this.bosses, this.bouncyBullets, this.hitBullet, null, this)
        this.physics.add.overlap(this.mobs, this.bouncyBullets, this.hitBullet, null, this)

        this.bgMusic = this.sound.add('bgMusic');
        this.bgMusic.loop = true;
        this.bgMusic.play();

        this.bossMusic = this.sound.add('bossMusic');
        this.bossMusic.loop = true;

        const {centerX, centerY} = this.cameras.main
        
        const menu = this.add.container(centerX, centerY)
        menu.setDepth(1)

        this.endGame = this.add.text(0, 0, "You were\nslain", {fontSize: 64, fill: "#B22222", fontStyle: "bold"}).setAlign("center").setVisible(false).setScrollFactor(0).setOrigin(0.5, 1)
        this.button = this.add.image(0, 0, "button").setVisible(false).setScrollFactor(0).setOrigin(0.5, 0)

        menu.add(this.endGame)
        menu.add(this.button)

        this.button.setInteractive()
    
        this.button.on("pointerdown",
            () => {
                this.player.enableBody(true, this.level.width*16, 1500 , true, true)

                this.player.timeOfFly = 0
                this.player.respawnTime = 300

                for(let g in inventory_label){
                    this.objectToPlace = inventory_label[g][0]
                }
                this.cur_elem.x = this.inventory[0].x

                this.player.mana = 10
                this.player.hp = 100

                this.bombs.clear(true, true)
                this.minions.clear(true, true)
                this.mobs.clear(true, true)
                this.bullets.clear(true, true)
                this.bouncyBullets.clear(true, true)
    
                this.button.setVisible(false)
                this.endGame.setVisible(false)
    
                this.gameover = false
            }
        )
    }
        
    update(){
        const justDownSpace = Phaser.Input.Keyboard.JustDown(this.cursors.space)

        this.player.update(this.cursors, this.a_key, this.d_key, justDownSpace)
        this.bullets.children.iterate((bullet) => {
            bullet.update()
        })
        this.mobBullets.children.iterate((mobBullet) => {
            mobBullet.update()
        })
        this.bouncyBullets.children.iterate((bouncyBullet) => {
            bouncyBullet.update()
        })
        this.minions.children.iterate((minion) => {
            minion.update()
        })

        this.bosses.children.iterate((boss) => {
            boss.update()
        })

        if(this.player.hp <= 0){
            this.player.disableBody(true, true);
            this.player.hp = 0
            this.gameover = true;
        }
        if(this.player.mana <= 0){
            this.player.mana = 0
        }
        if(this.player.hp >= 100){
            this.player.hp = 100
        }

        this.hpCount.setText("Health: " + this.player.hp)
        this.manaCount.setText("Mana: " + this.player.mana)

        if(this.gameover){
            this.endGame.setVisible(true)
            this.button.setVisible(true)
        }


        if(Math.random() < this.spawnRate){
            let mob = new Mob(this, Phaser.Math.Between(0, this.level.width*32), 1500, this.player, "zombie")
            this.mobs.add(mob)
            let mob1 = new Mob(this, Phaser.Math.Between(0, this.level.width*32), 1500, this.player, "spider")
            this.mobs.add(mob1)
        }
        this.mobs.children.iterate((mob) => {
            mob.update()
        })


        if(this.bombChaos){
            if(Math.random() < 0.5){
                let bomb = new Bomb(this, Phaser.Math.Between(0, this.level.width*32), 1000)
                this.bombs.add(bomb)
                bomb.fire()
            }

            if(this.bombChaosTime <= 0){
                this.bombs.clear(true, true)
                this.bombChaos = false
                this.bombChaosTime = 3600
                this.player.mana += 250
            }
            else if(this.gameover){
                this.bombs.clear(true, true)
                this.bombChaos = false
                this.bombChaosTime = 3600
            }
            else{
                this.bombChaosTime--
            }
        }
        if(!this.bombChaos){
            if(this.gameover == false){
                if(this.bombChaosPretime <= 0){
                    this.bombChaos = true
                    this.bombChaosPretime = Phaser.Math.Between(36000, 72000)
                }
                else{
                    this.bombChaosPretime--
                }
            }
        }




        if(this.bossChaos){
            if(this.gameover){
                this.bosses.clear(true, true)
                this.bossChaos = false
                this.bossMusic.stop();
                this.bgMusic.play();
                this.spawnRate = 0.005;
            }
        }
        if(!this.bossChaos){
            if(this.gameover == false){
                if(this.bossPretime <= 0){
                    let boss = new Boss(this, this.player.body.position.x + 300 + window.innerWidth / 2, 1200, this.player, "boss");
                    this.bosses.add(boss);
                    this.spawnRate = 0;
                    this.bgMusic.stop();
                    this.bossMusic.play();
                    this.bossPretime = Phaser.Math.Between(18000, 36000);
                    this.bossChaos = true;
                }
                else{
                    this.bossPretime--
                }
            }
        }


        const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

        const pointerTileX = this.level.map.worldToTileX(worldPoint.x);
        const pointerTileY = this.level.map.worldToTileY(worldPoint.y);

        this.marker.x = this.level.map.tileToWorldX(pointerTileX);
        this.marker.y = this.level.map.tileToWorldY(pointerTileY);

        if(this.gameover == false){
            if(this.player.respawnTime > 0){
                this.player.respawnTime--;
            }
            if(this.player.respawnTime <= 0){
                if(this.player.manaRegen > 0){
                    this.player.manaRegen--
                }
                else{
                    this.player.mana++
                    this.player.manaRegen = 300
                }

                if (this.player.hp < 100){
                    if(this.player.hpReload > 0){
                        this.player.hpReload--
                    }
                    else{
                        this.player.hp++
                        this.player.hpReload = 60
                    }
                }

                if (this.input.activePointer.buttons == 0){
                    this.player.timeOfBrake = 5
                }
                if (this.input.activePointer.buttons == 1){
                    switch(this.objectToPlace){
                        case 0:
                            if(this.player.timeOfBrake <= 0){
                                if(worldPoint.x - this.player.body.position.x < 200 && worldPoint.x - this.player.body.position.x > -200 && worldPoint.y - this.player.body.position.y < 200 && worldPoint.y - this.player.body.position.y > -200){
                                    this.level.map.putTileAt(0, pointerTileX, pointerTileY);
                                    this.player.timeOfBrake = 5
                                }
                            }
                            else{
                                this.player.timeOfBrake--;
                            }
                            break;
                        case 16:
                            if(this.player.timeOfBrake <= 0){
                                if(worldPoint.x - this.player.body.position.x < 200 && worldPoint.x - this.player.body.position.x > -200 && worldPoint.y - this.player.body.position.y < 200 && worldPoint.y - this.player.body.position.y > -200){
                                    this.level.map.putTileAt(16, pointerTileX, pointerTileY);
                                    this.player.timeOfBrake = 5
                                }
                            }
                            else{
                                this.player.timeOfBrake--;
                            }
                            break;
                        case 8:
                            if(this.player.timeOfBrake <= 0){
                                if(worldPoint.x - this.player.body.position.x < 200 && worldPoint.x - this.player.body.position.x > -200 && worldPoint.y - this.player.body.position.y < 200 && worldPoint.y - this.player.body.position.y > -200){
                                    this.level.map.putTileAt(8, pointerTileX, pointerTileY);
                                    this.player.timeOfBrake = 5
                                }
                            }
                            else{
                                this.player.timeOfBrake--;
                            }
                            break;
                        case 192:
                            if(this.player.timeOfBrake <= 0){
                                if(worldPoint.x - this.player.body.position.x < 200 && worldPoint.x - this.player.body.position.x > -200 && worldPoint.y - this.player.body.position.y < 200 && worldPoint.y - this.player.body.position.y > -200){
                                    this.level.map.putTileAt(192, pointerTileX, pointerTileY);
                                    this.player.timeOfBrake = 5
                                }
                            }
                            else{
                                this.player.timeOfBrake--;
                            }
                            break;
                        case 55:
                            if(this.player.timeOfBrake <= 0){
                                if(worldPoint.x - this.player.body.position.x < 200 && worldPoint.x - this.player.body.position.x > -200 && worldPoint.y - this.player.body.position.y < 200 && worldPoint.y - this.player.body.position.y > -200){
                                    this.level.map.putTileAt(55, pointerTileX, pointerTileY);
                                    this.player.timeOfBrake = 5
                                }
                            }
                            else{
                                this.player.timeOfBrake--;
                            }
                            break;
                        case 167:
                            if(this.player.timeOfBrake <= 0){
                                if(worldPoint.x - this.player.body.position.x < 200 && worldPoint.x - this.player.body.position.x > -200 && worldPoint.y - this.player.body.position.y < 200 && worldPoint.y - this.player.body.position.y > -200){
                                    this.level.map.removeTileAt(pointerTileX, pointerTileY);
                                    this.player.timeOfBrake = 20
                                }
                            }
                            else{
                                this.player.timeOfBrake--;
                            }
                            break;




                        case 156:
                            if(this.player.reloadTime <= 0){
                                if(this.player.mana > 2){
                                    var bullet = new Bullet(this, this.player.body.position.x + this.player.body.width / 2, this.player.body.position.y + this.player.body.height / 2, window.innerWidth, worldPoint)
                                    this.bullets.add(bullet)
                                    bullet.shoot(this.player)
                                    this.player.mana -= 3;
                                    this.player.reloadTime = 30;
                                }
                            }
                            break;
                        case 159:
                            if(this.player.reloadTime <= 0){
                                if(this.player.mana > 2){
                                    this.bouncyBullets.clear(true, true)
                                    var bouncyBullet = new BouncyBullet(this, this.player.body.position.x + this.player.body.width / 2, this.player.body.position.y + this.player.body.height / 2, 1500)
                                    this.bouncyBullets.add(bouncyBullet)
                                    bouncyBullet.shoot(this.player)
                                    this.player.mana -= 3;
                                    this.player.reloadTime = 30;
                                }
                            }
                            break;
                        case 185:
                            if(this.player.reloadTime <= 0){
                                if(this.player.mana > 69){
                                    this.mobs.children.iterate((mob) => {
                                        mob.disableBody(true, false)
                                    })
                                    this.bombs.children.iterate((bomb) => {
                                        bomb.disableBody(true, false)
                                    })
                                    this.player.mana -= 70;
                                    this.player.reloadTime = 300;
                                }
                            }
                            break;
                        case 174:
                            if(this.player.reloadTime <= 0){
                                if(this.player.mana > 49){
                                    let minion = new Minion(this, this.player.body.position.x, this.player.body.position.y, true, this.player, "minion")
                                    let minion1 = new Minion(this, this.player.body.position.x, this.player.body.position.y, false, this.player, "minion")
                                    this.minions.add(minion)
                                    this.minions.add(minion1)
                                    this.player.mana -= 50;
                                    this.player.reloadTime = 180;
                                }
                            }
                            break
                        case 251:
                            if(this.player.reloadTime <= 0){
                                if(this.player.mana > 49){
                                    if(this.player.hp < 100){
                                        this.player.hp += 50;
                                        this.player.mana -= 50;
                                        this.player.reloadTime = 120;
                                    }
                                }
                            }
                            break;
                        case 248:
                            if(this.player.reloadTime <= 0){
                                if(this.player.mana > 14){
                                    this.player.timeOfFly += 300;
                                    this.player.mana -= 15;
                                    this.player.reloadTime = 360;
                                }
                            }
                            break;
                        case 292:
                            if(this.player.reloadTime <= 0){
                                if(this.player.mana > 49){
                                    this.player.setPosition(worldPoint.x, worldPoint.y)
                                    this.player.hp -= 20
                                    this.player.mana -= 50;
                                    this.player.reloadTime = 180;
                                }
                            }
                            break;
                        case 355:
                            if(this.player.reloadTime <= 0){
                                if(this.player.hp > 50){
                                    this.player.hp -= 50
                                    this.player.mana += 50;
                                    this.player.reloadTime = 60;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        if(this.player.reloadTime > 0){
            this.player.reloadTime--
            this.reloadText.setVisible(true)
        }
        else{
            this.reloadText.setVisible(false)
        }







        this.mobs.children.iterate((mob) => {
            if(mob.spriteSheet == "spider"){
                if(mob.hp > 0){
                    if(mob.visiblePlayer){
                        if(mob.reloadingShootTime <= 0){
                            var bullet = new Bullet(this, mob.body.position.x + mob.body.width / 2, mob.body.position.y + mob.body.height / 2, window.innerWidth, this.player)
                            this.mobBullets.add(bullet)
                            bullet.shoot(mob)
                            mob.reloadingShootTime = 300
                        }
                        else{
                            mob.reloadingShootTime--
                        }
                    }
                }
            }
        })
    }

    inventorySwitch(object, index){
        this.objectToPlace = object;
        this.cur_elem.x = this.inventory[index].x
    }
    
    hitBomb(player, bombs){
        if(!this.gameover){
            if(player.respawnTime <= 0){
                player.hp -= 3
            }
        }
    }

    hitEnemy(player, mob){
        if(!this.gameover){
            if(player.respawnTime <= 0){
                if(mob.hp > 0){
                    if(mob.reloadingTime <= 0){
                        player.hp -= Phaser.Math.Between(mob.damage - 5, mob.damage + 5);
                        player.isDamaging = true;
                        mob.reloadingTime = 120;
                    }
                }
            }
        }
    }
    
    hitBullet(mob, bullet){
        mob.hp--
        if(mob.hp >= 0){
            // let explosion = new Explosion(this, bullet.body.position.x, bullet.body.position.y, "explosion")
            // this.explosions.add(explosion)
            // explosion.fire()
            bullet.destroy()
        }
        if(mob.hp == 0){
            mob.anims.play("dead")
            mob.setVelocityX(0)
            mob.on("animationcomplete", () =>{
                if(mob.spriteSheet == "boss"){
                    this.player.mana += 1000;
                    this.spawnRate = 0.005;
                    this.bossMusic.stop();
                    this.bgMusic.play();
                    this.bossChaos = false;
                    this.bosses.clear();
                }
                else{
                    this.player.levelPoints++;
                    this.player.mana += Phaser.Math.Between(3, 7);
                    mob.disableBody(true, true);
                }
            })
        }
    }

    bulletWithBlock(bullet){
        // let explosion = new Explosion(this, bullet.body.position.x, bullet.body.position.y, "explosion")
        // this.explosions.add(explosion)
        // explosion.fire()
        bullet.destroy()
    }
}
