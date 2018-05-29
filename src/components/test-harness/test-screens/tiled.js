import { Screen } from "../../../core/screen.js";
import * as debug from "../../../core/debug.js";
import * as signal from "../../../core/signal-bus.js";

export class TiledTest extends Screen {
    constructor() {
        super();
    }

    preload() {
        const debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        debugKey.onUp.add(() => {
            debug.toggle(this.game);
        });
    }

    create() {
        this.scene.addLayout(["home", "pause", "audioOff", "settings", "continue"]);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

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
        map.addTilesetImage("tiled.grassTile", "tiled.grassTile", 32, 32);
        map.setCollision(0);
        this.layer = map.createLayer(0);
        this.layer.resizeWorld();
        // TODO: Center the tilemap - this functionality may need fixing in GENIE Core
        this.scene.addToBackground(this.layer);

        this.sprite = this.game.add.sprite(0, -300, "tiled.basicSprite");
        this.game.physics.arcade.enable(this.sprite);
        debug.add(this.sprite, "rgba(255,0,0,0.4)", true);
        this.scene.addToBackground(this.sprite);

        this.sprite.body.bounce.y = 0.2;
        this.sprite.body.linearDamping = 1;
        this.sprite.body.gravity.y = 100;

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "continue",
            callback: this.navigation.next,
        });
    }

    update() {
        this.game.physics.arcade.collide(this.sprite, this.layer);
    }

    render() {
        debug.render(this.game);
    }
}
