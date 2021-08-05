/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import { eventBus } from "../event-bus.js";
import { collections } from "../collections.js";
import { gmi } from "../gmi/gmi.js";
import { accessibilify } from "../accessibility/accessibilify.js";

class ShopDemo extends Screen {
	create() {
		this.addBackgroundItems();
		this.setLayout(["back"]);

		this.buttons = ["Game", "Shop"].map((id, idx) =>
			createButton(this, id, idx, () => this.navigation[id.toLowerCase()]()),
		);
	}
}

class ShopDemoGame extends Screen {
	preload() {
		this.plugins.addToScene(this.sys, [], [["ArcadePhysics"]]);
		this.physics.start();
	}

	create() {
		this.addBackgroundItems();
		this.setLayout(["back", "pause"]);

		createAnims(this);
		setupInput(this);

		this.balanceUI = createBalance(this);
		this.sounds = createSounds(this);
		this.cursors = this.input.keyboard.createCursorKeys();

		const trees = addTrees(this);

		this.entities = {
			trees,
			coins: addCoins(this, trees),
			player: addPlayer(this),
		};

		this.getCoin = getCoin(this);
		this.woodChop = chopWood(this);
		this.buttons = createCheatButtons(this);
	}

	update() {
		this.entities.player.update();
		if (this.cursors.space.isDown) {
			this.entities.player.chopWood();
		}
		updateCoins(this);
	}
}

const setupInput = scene =>
	scene.children.list[0].setInteractive().on("pointerup", () => scene.entities.player.chopWood());

const createBalance = scene => {
	const { balance } = scene.config;
	const currency = getCurrencyItem(scene);
	const text = scene.add.text(balance.x, balance.y, `Coins: ${currency.qty}`, balance.style);
	return {
		text,
		setBalance: bal => text.setText(`Coins: ${bal}`),
	};
};

const createSounds = scene => {
	const { assets } = scene.config;
	return {
		coinGet: scene.sound.add(assets.coinGet.key),
		hit: scene.sound.add(assets.hit.key),
		whiff: scene.sound.add(assets.whiff.key),
	};
};

const createCheatButtons = scene => {
	return [
		createButton(scene, "Reset", 0, () => resetEconomy(scene)),
		createButton(scene, "AddCoin", 1, () => scene.getCoin()),
	];
};

const createButton = (scene, id, idx, callback) => {
	const button = scene.add.gelButton(500 + 400 * idx, 500, {
		gameButton: true,
		channel: scene.config.eventChannel,
		group: scene.scene.key,
		id,
		key: "button",
		scene: "gelDebug",
		callback,
	});
	button.overlays.set("label", scene.add.text(0, 0, id).setOrigin(0.5));

	const buttonSub = eventBus.subscribe({
		channel: scene.config.eventChannel,
		name: id,
		callback: button.config.callback,
	});
	scene.events.once("shutdown", buttonSub.unsubscribe);
	return accessibilify(button);
};

const resetEconomy = scene => {
	gmi.setGameData("genie", { collections: {} });
	scene.balanceUI.setBalance(1000);
	scene.entities.player.sprite.destroy();
	scene.entities.player.container.destroy();
	createAnims(scene);
	scene.entities.player = addPlayer(scene);
};

const getCoin = scene => () => {
	const currency = getCurrencyItem(scene);
	const balance = currency.qty + 1;
	scene.sounds.coinGet.play();
	scene.balanceUI.setBalance(balance);
	getInventory(scene).set({ ...currency, qty: balance });
};

const getCurrencyItem = scene => getInventory(scene).get(scene.config.balance.value.key);
const getInventory = scene => collections.get(scene.transientData.shop.config.shopCollections.manage);

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
			wasChopped: () => {
				scene.sounds.hit.play();
				coins.forEach(coin => coin.fall());
			},
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

const doCoinsLanding = (coins, groundY) => {
	coins
		.filter(coin => coin.sprite.body.gravity.y !== 0)
		.filter(coin => coin.sprite.y >= groundY)
		.forEach(coin => coin.sprite.setGravityY(0).setVelocityY(0).setY(groundY));
};

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
	sprite.walkRight = true;
	sprite.play("walk");
	container.add(sprite);
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
			const { x } = container;
			if (Math.abs(x) > player.xLimit) {
				sprite.walkRight = !sprite.walkRight;
				sprite.setFlipX(!sprite.flipX);
			}
			container.setX(x + player.speed * (sprite.walkRight ? 1 : -1));
		},
	};
};
const chopWood = scene => player => {
	const range = { low: player.x - scene.config.colliderSize, high: player.x + scene.config.colliderSize };
	scene.sounds.whiff.play();
	scene.entities.trees
		.filter(tree => tree.sprite.x >= range.low && tree.sprite.x <= range.high)
		.map(tree => tree.wasChopped());
};

const getSpritesheetForBestHat = scene =>
	getInventory(scene)
		.getAll()
		.filter(item => item.tags.includes("demo-hat"))
		.filter(item => item.state === "equipped")
		.sort((a, b) => (a.price < b.price ? 1 : -1))[0]?.userData.key ?? "shopDemo.ironHat";

const createAnims = scene => {
	scene.anims.create({
		key: "coinSpin",
		frames: scene.anims.generateFrameNumbers(scene.config.assets.coin.key, { start: 0, end: 8 }),
		frameRate: 12,
		repeat: -1,
	});
	scene.anims.create({
		key: "coinPop",
		frames: scene.anims.generateFrameNumbers(scene.config.assets.coinPop.key, { start: 0, end: 6 }),
		frameRate: 10,
		repeat: 0,
	});

	const playerSheet = getSpritesheetForBestHat(scene);
	["walk", "chop"].forEach(animKey => scene.anims.remove(animKey));
	scene.anims.create({
		key: "walk",
		frames: scene.anims.generateFrameNumbers(playerSheet, { start: 0, end: 7 }),
		frameRate: 12,
		repeat: -1,
	});
	scene.anims.create({
		key: "chop",
		frames: scene.anims.generateFrameNumbers(playerSheet, { start: 8, end: 14 }),
		frameRate: 15,
		repeat: 0,
	});
};

export { ShopDemo, ShopDemoGame };
