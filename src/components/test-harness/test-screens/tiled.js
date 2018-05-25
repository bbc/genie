import { Screen } from "../../../core/screen.js";
import * as debug from "../../../core/debug.js";
import * as signal from "../../../core/signal-bus.js";

export class TiledTest extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.keyLookup = this.scene.keyLookups["tiled"];
        const debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        debugKey.onUp.add(() => {
            debug.toggle(this.game);
        });
    }

    create() {
        this.scene.addLayout(["home", "pause", "audioOff", "settings", "continue"]);
        this.game.physics.startSystem(Phaser.Physics.ARCADE); // TODO: Enable physics and drop and item onto the platform

        const data = `
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1,  0,  0,  0,  0,  0,  0,  0,  0, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
        `;

        this.game.cache.addTilemap("testTileMap", null, data, Phaser.Tilemap.CSV);

        const map = this.game.add.tilemap("testTileMap", 32, 32);
        map.addTilesetImage(this.keyLookup.grassTile, this.keyLookup.grassTile, 32, 32);
        const layer = map.createLayer(0);
        layer.resizeWorld();

        this.scene.addToBackground(layer);

        // TODO: Center the tilemap - this functionality may need fixing in GENIE Core
        // TODO: Add debug view support for the tilemap

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "continue",
            callback: this.navigation.next,
        });
    }

    update() {}

    render() {
        debug.render(this.game);
    }
}
