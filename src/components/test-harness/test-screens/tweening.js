/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../../core/screen.js";
import * as debug from "../../../core/debug.js";
import * as signal from "../../../core/signal-bus.js";

export class TweeningTest extends Screen {
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
        this.scene.addLayout(["home", "pause", "audio", "settings", "continue"]);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.sprite = this.game.add.sprite(0, 0, "tweening.basicSprite");
        this.scene.addToBackground(this.sprite);
        this.game.physics.arcade.enable(this.sprite);
        debug.add(this.sprite, "rgba(255,0,0,0.4)", true);

        this.game.add.tween(this.sprite.scale).to({ x: 3, y: 3 }, 500, "Linear", true, 0, -1, true);

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "continue",
            callback: this.navigation.next,
        });
    }

    render() {
        debug.render(this.game);
    }
}
