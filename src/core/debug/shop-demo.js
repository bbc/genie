/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import { eventBus } from "../event-bus.js";
import { collections } from "../collections.js";

class ShopDemo extends Screen {
    create() {
        this.addBackgroundItems();
        this.setLayout(["back"]);

        this.buttons = createButtons(["Game", "Shop"], this);
    }
}

const createButtons = (ids, scene) =>
    ids.map((id, idx) => {
        const button = scene.add.gelButton(500 + 400 * idx, 500, {
            gameButton: true,
            channel: scene.config.eventChannel,
            group: scene.scene.key,
            id,
            key: "button",
            scene: "gelDebug",
            callback: () => scene.navigation[id.toLowerCase()](),
        });
        button.overlays.set("label", scene.add.text(0, 0, id).setOrigin(0.5));

        const buttonSub = eventBus.subscribe({
            channel: scene.config.eventChannel,
            name: id,
            callback: button.config.callback,
        });
        scene.events.once("shutdown", buttonSub.unsubscribe);
    });

class ShopDemoGame extends Screen {
    create() {
        this.addBackgroundItems();
        this.setLayout(["back", "pause"]);

        createAnims(this);
        
        const trees = addTrees(this);
        
        this.entities = {
            trees,
            coins: addCoins(this, trees),
            player: addPlayer(this),
        };
        
        this.woodChop = chopWood(this);

        this.cursors = this.input.keyboard.createCursorKeys();

        console.log("BEEBUG: this", this);
    }
    update() {
        this.entities.player.update();
        if (this.cursors.space.isDown) {
            this.entities.player.chopWood();
        }
    }
}

const addTrees = scene =>
    scene.config.treeSpawns.map(fixture =>
        scene.add
            .image(fixture.x, fixture.y, scene.config.assets[fixture.key].key)
            .setFlipX(fixture.flip)
            .setScale(scene.config.assets[fixture.key].scale),
    );

const createAnims = scene => {
    const coinSheet = scene.config.assets.coin.key;
    const coinPopSheet = scene.config.assets.coin.key;
    const playerSheet = scene.config.assets.player.key;
    scene.anims.create({
        key: "coinSpin",
        frames: scene.anims.generateFrameNumbers(coinSheet, { start: 0, end: 8 }),
        frameRate: 12,
        repeat: -1,
    });
    scene.anims.create({
        key: "coinPop",
        frames: scene.anims.generateFrameNumbers(coinPopSheet, { start: 0, end: 5 }),
        frameRate: 12,
        repeat: -1,
    });
    scene.anims.create({
        key: "walk",
        frames: scene.anims.generateFrameNumbers(playerSheet, { frames: [8, 9, 10, 11, 12, 13, 14, 15] }),
        frameRate: 12,
        repeat: -1,
    });
    scene.anims.create({
        key: "chop",
        frames: scene.anims.generateFrameNumbers(playerSheet, { frames: [16, 17, 18, 19, 20, 21, 22] }),
        frameRate: 15,
        repeat: 0,
    });
};

const addCoins = (scene, trees) => {
    trees.map(tree => scene.config.coinSpawns.map(spawnPoint => addCoinSpawnPoint(scene, tree, spawnPoint)))
    ;
};

const addCoinSpawnPoint = (scene, tree, point) => {
    const { assets } = scene.config;
    const sprite = scene.add.sprite(tree.x + point.x, tree.y + point.y).setScale(assets.coin.scale);
    sprite.play("coinSpin");
    return {
        sprite,
        pickUp: () => console.log("pickup"),
        respawn: () => console.log("respawn"),
        fall: () => console.log("falling"),
        update: () => {},
    };
};

const chopWood = scene => sprite => {
    console.log("chop x, y", sprite.x, sprite.y);
    // get the timer
    // get the player x, y and make a range
    // filter trees to ones in range
};

const addPlayer = scene => {
    const { player, groundY, assets } = scene.config;
    const sprite = scene.add.sprite(player.spawn.x, groundY).setScale(assets.player.scale);
    sprite.walkRight = true;
    sprite.play("walk");
    return {
        sprite,
        chopWood: () => {
            sprite.play("chop");
            sprite.anims.chain("walk");
            scene.woodChop(sprite);
        },
        update: () => {
            const { x, y } = sprite;
            if (Math.abs(x) > player.xLimit) {
                sprite.walkRight = !sprite.walkRight;
                sprite.setFlipX(!sprite.flipX);
            }
            sprite.setX(x + player.speed * (sprite.walkRight ? 1 : -1));
        },
    };
};

export { ShopDemo, ShopDemoGame };
