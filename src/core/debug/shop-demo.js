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

        this.balanceUI = createBalance(this);
        this.getCoin = getCoin(this);

        const trees = addTrees(this);

        this.entities = {
            trees,
            coins: addCoins(this, trees),
            player: addPlayer(this),
        };

        this.woodChop = chopWood(this);
        this.cursors = this.input.keyboard.createCursorKeys();

        console.log("BEEBUG: this", this);
        // make a reset button
    }
    update() {
        this.entities.player.update();

        if (this.cursors.space.isDown) {
            this.entities.player.chopWood();
        }
        updateCoins(this);
    }
}

const chopWood = scene => player => {
    console.log("BEEBUG: player", player);
    const range = { low: player.x - scene.config.colliderSize, high: player.x + scene.config.colliderSize }; // could do with an offset in the facing dir
    scene.entities.trees
        .filter(tree => tree.sprite.x >= range.low && tree.sprite.x <= range.high)
        .map(tree => tree.wasChopped());
};

const createBalance = scene => {
    const { balance } = scene.config;
    const currency = getCurrencyItem(scene);
    const text = scene.add.text(balance.x, balance.y, `Coins: ${currency.qty}`, balance.style);
    return {
        text,
        setBalance: bal => text.setText(`Coins: ${bal}`),
    };
};

const getCoin = scene => () => {
    const currency = getCurrencyItem(scene);
    const balance = currency.qty + 1;
    scene.balanceUI.setBalance(balance);
    getInventory(scene).set({ ...currency, qty: balance });
};

const getCurrencyItem = scene => getInventory(scene).get(scene.config.balance.value.key);
const getInventory = scene => collections.get(scene.config.paneCollections.manage);

const addTrees = scene =>
    scene.config.treeSpawns.map(fixture => {
        const sprite = scene.add
            .image(fixture.x, fixture.y, scene.config.assets[fixture.key].key)
            .setFlipX(fixture.flip)
            .setScale(scene.config.assets[fixture.key].scale);
        const coins = [];
        return {
            sprite,
            coins,
            wasChopped: () => coins.forEach(coin => coin.fall()),
        };
    });

const addCoins = (scene, trees) =>
    trees
        .map(tree =>
            scene.config.coinSpawns.map(spawnPoint => {
                const coin = addCoin(scene, tree, spawnPoint);
                tree.coins.push(coin);
                return coin;
            }),
        )
        .flat();

const addCoin = (scene, tree, point) => {
    const { assets, gravity } = scene.config;
    const spawnPoint = { x: tree.sprite.x + point.x, y: tree.sprite.y + point.y };
    const sprite = scene.physics.add.sprite(spawnPoint.x, spawnPoint.y).setScale(assets.coin.scale).setGravityY(0);
    sprite.play("coinSpin");
    return {
        sprite,
        spawnPoint,
        isDespawned: false,
        despawnedAt: 0,
        fall: () => {
            if (sprite.y === spawnPoint.y) sprite.setGravityY(gravity);
        },
    };
};

const updateCoins = scene => {
    const {
        entities: { coins },
        config: { groundY },
    } = scene;
    doCoinsLanding(coins, groundY);
    doCoinsCollected(scene);
    doCoinsRespawned(scene);
};

const doCoinsLanding = (coins, groundY) =>
    coins
        .filter(coin => coin.sprite.body.gravity.y !== 0)
        .filter(coin => coin.sprite.y >= groundY)
        .forEach(coin => coin.sprite.setGravityY(0).setVelocityY(0).setY(groundY));

const doCoinsCollected = scene => {
    const {
        entities: { coins, player },
        config: { groundY, colliderSize },
    } = scene;
    coins
        .filter(coin => !coin.isDespawned)
        .filter(coin => Math.abs(coin.sprite.y - groundY) <= colliderSize)
        .filter(coin => Math.abs(coin.sprite.x - player.container.x) <= colliderSize)
        .forEach(coin => {
            despawnCoin(scene, coin);
            scene.getCoin();
        });
};

const despawnCoin = (scene, coin) => {
    coin.sprite.play("coinPop");
    coin.isDespawned = true;
    coin.despawnedAt = scene.time.now;
};

const doCoinsRespawned = scene => {
    const {
        entities: { coins },
        config: { timers },
    } = scene;
    coins
        .filter(coin => coin.isDespawned)
        .filter(coin => coin.despawnedAt + timers.coinSpawn < scene.time.now)
        .forEach(coin => respawnCoin(coin));
};

const respawnCoin = coin => {
    coin.sprite.play("coinSpin");
    coin.sprite.setPosition(coin.spawnPoint.x, coin.spawnPoint.y);
    coin.isDespawned = false;
};

const addPlayer = scene => {
    const { player, groundY, assets, timers } = scene.config;
    const container = scene.add.container().setPosition(player.spawn.x, groundY);
    const sprite = scene.add.sprite(0, 0).setScale(assets.player.scale);
    const hat = scene.add.sprite(0, player.hat.yOffset, getBestEquippedHat(scene)).setScale(player.hat.scale);
    sprite.walkRight = true;
    sprite.play("walk");
    container.add([sprite, hat]);
    return {
        sprite,
        container,
        chopWood: () => {
            if (!sprite.lastChopTime || sprite.lastChopTime + timers.chopDebounce < scene.time.now) {
                sprite.lastChopTime = scene.time.now;
                sprite.play("chop");
                sprite.anims.chain("walk");
                scene.woodChop(container);
            }
        },
        update: () => {
            const { x, y } = container;
            if (Math.abs(x) > player.xLimit) {
                sprite.walkRight = !sprite.walkRight;
                sprite.setFlipX(!sprite.flipX);
            }
            container.setX(x + player.speed * (sprite.walkRight ? 1 : -1));
        },
        getCoin: () => console.log("coin get"),
    };
};

const getBestEquippedHat = scene =>
    getInventory(scene)
        .getAll()
        .filter(item => item.tags.includes("demo-hat"))
        .filter(item => item.state === "equipped")
        .sort((a, b) => (a.price < b.price ? 1 : -1))[0]?.userData.key ?? "shopDemo.noHat";

const createAnims = scene => {
    const coinSheet = scene.config.assets.coin.key;
    const coinPopSheet = scene.config.assets.coinPop.key;
    const playerSheet = scene.config.assets.player.key;
    scene.anims.create({
        key: "coinSpin",
        frames: scene.anims.generateFrameNumbers(coinSheet, { start: 0, end: 8 }),
        frameRate: 12,
        repeat: -1,
    });
    scene.anims.create({
        key: "coinPop",
        frames: scene.anims.generateFrameNumbers(coinPopSheet, { start: 0, end: 6 }),
        frameRate: 12,
        repeat: 0,
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

export { ShopDemo, ShopDemoGame };
