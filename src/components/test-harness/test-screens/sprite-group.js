/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../../core/screen.js";
import * as debug from "../../../core/debug.js";
import * as signal from "../../../core/signal-bus.js";

export class SpriteGroupTest extends Screen {
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

        this.spriteGroup = this.game.add.group();

        for (let xPos = -200; xPos <= 200; xPos += 200) {
            const sprite = this.game.add.sprite(xPos, 0, "spriteGroup.basicSprite");
            this.game.physics.arcade.enable(sprite);
            debug.add(sprite, "rgba(255,0,0,0.4)", true);
            this.spriteGroup.add(sprite);
        }

        this.scene.addToBackground(this.spriteGroup);

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
