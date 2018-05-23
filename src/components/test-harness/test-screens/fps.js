import { Screen } from "../../../core/screen.js";

export class FpsTest extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.keyLookup = this.scene.keyLookups["game"];
        this.game.time.advancedTiming = true;
    }

    create() {
        this.scene.addLayout(["home", "pause", "audioOff", "settings"]);
        this.sprites = [];

        for (let xPos = -200; xPos <= 200; xPos += 100) {
            const sprite = this.game.add.sprite(xPos, 0, this.keyLookup.basicSprite);
            this.scene.addToBackground(sprite);
            this.sprites.push(sprite);
        }

        this.fpsDebug = this.game.add.text(0, -250, "", { font: "36px Arial", fill: "#ffffff" });
        this.scene.addToBackground(this.fpsDebug);
    }

    update() {
        this.sprites.forEach(sprite => {
            sprite.rotation += 0.1;
        });
    }

    render() {
        this.fpsDebug.setText("FPS: " + this.game.time.fps || "--", 2, 14, "#00ff00");
    }
}
