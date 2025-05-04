export default class LevelGenerator {
    constructor(scene, tilemapKey, tilesetKey, y, tileSize = 16, width = 500, height = 300) {
        this.scene = scene;
        this.tileSize = tileSize;
        this.width = width;
        this.height = height;
        this.y = y
        this.map = this.scene.make.tilemap({ width, height, tileWidth: tileSize, tileHeight: tileSize });
        this.tileset = this.map.addTilesetImage(tilemapKey, tilesetKey);
        this.layer = this.map.createBlankLayer("World", this.tileset, 0, this.y);
        this.terrainHeights;

        this.generateLevel();

        this.map.setCollisionByExclusion([-1], true, this.layer);
        this.layer.setScale(2)
    }

    generateLevel() {
        let levelData = this.generateTerrain();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let tileIndex = levelData[y][x];
                if (tileIndex !== -1) {
                    this.layer.putTileAt(tileIndex, x, y);  
                }
            }
        }
    }

    generateTerrain() {
        let data = Array.from({ length: this.height }, () => Array(this.width).fill(-1));

        const TILE_DIRT = 16;
        const TILE_GRASS = 0;
        const TILE_WATER = 192;

        const TILE_STONE = 8;
        const TILE_DIAMOND_ORE = 38;
        const TILE_IRON_ORE = 19;

        const TILE_TREE = 49;
        const TILE_TREE_TALL_ONE = 80;
        const TILE_TREE_TALL_TWO = 64;
        const TILE_TREE_TALL_THREE = 48;

        const TILE_WOOD = 55;

        this.terrainHeights = Array(this.width).fill(0).map((_, x) => Math.floor(Phaser.Math.Between(50, 51) + Math.sin(x * 0.3) * Phaser.Math.Between(1, 3)));

        for (let x = 0; x < this.width; x++) {
            let groundHeight = this.terrainHeights[x];

            for (let y = groundHeight; y < this.height; y++) {
                data[y][x] = TILE_DIRT;
            }

            if (groundHeight < this.height) {
                data[groundHeight][x] = TILE_GRASS;

                if (Math.random() < 0.1) {
                    data[groundHeight - 1][x] = TILE_TREE;
                }
                if (Math.random() < 0.15) {
                    data[groundHeight - 1][x] = TILE_TREE_TALL_ONE;
                    data[groundHeight - 2][x] = TILE_TREE_TALL_TWO;
                    data[groundHeight - 3][x] = TILE_TREE_TALL_THREE;
                }
            }

            for (let y = groundHeight + Phaser.Math.Between(15, 20); y < this.height; y++) {
                data[y][x] = TILE_STONE;
            }

            for (let y = groundHeight + 50; y < this.height; y++){
                if(Math.random() < 0.01){
                    data[y][x] = TILE_IRON_ORE;
                }
            }

            for (let y = groundHeight + 150; y < this.height; y++){
                // 0.001
                if(Math.random() < 0.001){
                    data[y][x] = TILE_DIAMOND_ORE;
                }
            }
        }

        for(let i=0; i<10; i++){
            let waterStart = Phaser.Math.Between(5, this.width - 15);
            let waterWidth = Phaser.Math.Between(5, 10);
            for (let x = waterStart; x < waterStart + waterWidth; x++) {
                let waterHeight = this.terrainHeights[x] + Phaser.Math.Between(0, 3);
                for (let y = waterHeight; y < waterHeight + 3; y++) {
                    if (y < this.height) {
                        data[y][x] = TILE_WATER;
                    }
                }
            }
        }

        for(let i=0; i<5; i++){
            let groundWaterStart = Phaser.Math.Between(5, this.width - 15);
            let groundWaterWidth = Phaser.Math.Between(15, 25);
            for (let x = groundWaterStart; x < groundWaterStart + groundWaterWidth; x++) {
                let groundWaterHeight = this.terrainHeights[x] + Phaser.Math.Between(50, 53);
                for (let y = groundWaterHeight; y < groundWaterHeight + 3; y++) {
                    if (y < this.height) {
                        data[y][x] = TILE_WATER;
                    }
                }
            }
        }

        for(let i = 0; i < 3; i++){
            let groundCaveStart = Phaser.Math.Between(0, this.width)
            let groundCaveWidth = Phaser.Math.Between(7, 15);

            let groundCaveStartY = 20
            let groundCaveWidthY = Phaser.Math.Between(150, 250);

            for (let y = groundCaveStartY; y < groundCaveStartY + groundCaveWidthY; y++) {
                let start_x = Phaser.Math.Between(groundCaveStart, groundCaveStart + groundCaveWidth);
                let end_x = Phaser.Math.Between(start_x + groundCaveWidth, groundCaveStart + groundCaveWidth + Phaser.Math.Between(10, 15));
                
                for(let x = start_x; x < end_x; x++){
                    data[y][x] = -1;
                }
            }
        }

        data[this.height-1][this.width-1] = TILE_WOOD

        return data;
    }
}