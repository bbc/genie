/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import { eventBus } from "../event-bus.js";

const createButtons = (ids, scene) =>
    ids.map((id, idx) => {
        const button = scene.add.gelButton(500 + 400 * idx, 400, {
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

class ShopDemo extends Screen {
    create() {
        this.addBackgroundItems();
        this.setLayout(["back"]);

        this.buttons = createButtons(["Game", "Shop"], this);
    }
}

class ShopDemoGame extends Screen {
    create() {
        this.addBackgroundItems();
        this.setLayout(["back"]);
        
        addFixtures(this);

        this.entities = {
            coins: addCoins(this),
            player: addPlayer(this),
        }

        console.log("BEEBUG: this", this);
    }
}

const addFixtures = scene =>
    scene.config.fixtures.forEach(fixture =>
        scene.add
            .image(fixture.x, fixture.y, scene.config.assets[fixture.key].key)
            .setFlipX(fixture.flip)
            .setScale(scene.config.assets[fixture.key].scale),
    );

const addCoins = scene => scene.config.coinSpawns.map(spawnPoint => addCoinSpawnPoint(scene, spawnPoint));
const addCoinSpawnPoint = (scene, point) => {
    const { assets } = scene.config;
    return {
        sprite: scene.add.sprite(point.x, point.y, assets.coin.key).setScale(assets.coin.scale),
    };
};

const addPlayer = scene => {
    const { player, groundY, assets } = scene.config;
    const sprite = scene.add.sprite(player.spawn.x, groundY, assets.dwarf.key).setScale(assets.dwarf.scale);
    return { sprite };
};

export { ShopDemo, ShopDemoGame };
