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
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.map = this.game.add.tilemap(this.keyLookup.basicMap, 32, 32);
        this.map.addTilesetImage(this.keyLookup.grassTile);
        this.layer = this.map.createLayer(0);
        this.layer.resizeWorld();
        this.scene.addToBackground(this.layer);

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "continue",
            callback: this.navigation.next,
        });
    }

    update() {
        // do an update
    }

    render() {
        debug.render(this.game);
    }
}
