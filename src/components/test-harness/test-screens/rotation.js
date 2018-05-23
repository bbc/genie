import { Screen } from "../../../core/screen.js";

export class RotationTest extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.keyLookup = this.scene.keyLookups["game"];
    }

    create() {
        this.scene.addLayout(["home", "pause", "audioOff", "settings"]);
        this.sprite = this.game.add.sprite(200, -100, this.keyLookup.basicSprite);
        this.scene.addToBackground(this.sprite);
    }

    update() {
        if (this.sprite.x > -200 || this.sprite.y < 100) {
            this.sprite.x -= 0.8;
            this.sprite.y += 0.4;
        }

        this.sprite.rotation += 0.1;
    }
}
