import { createTestHarnessDisplay } from "src/components/test-harness/layout";
import { Screen } from "src/core/screen";
import { accessibilify } from "../lib/accessibilify";

export class Home extends Screen {
    private keyLookup: { [key: string]: string };
    private gel: { [key: string]: string };

    constructor() {
        super();
    }

    public preload() {
        this.keyLookup = this.context.layoutFactory.keyLookups[this.game.state.current];
        this.gel = this.context.layoutFactory.keyLookups.gel;
    }

    public create() {
        this.context.layoutFactory.addToBackground(this.game.add.image(0, 0, this.keyLookup.background));
        this.context.layoutFactory.addToBackground(this.game.add.image(0, -150, this.keyLookup.title));
        this.context.layoutFactory.addToBackground(this.game.add.button(0, 0, this.gel.play)); // remove when layout handles this
        this.context.layoutFactory.create(["exit", "howToPlay", "play", "soundOff", "settings"], this.gel);
        createTestHarnessDisplay(this.game, this.context);
        // ===
        const button = new Phaser.Button(this.game, -200, -100, this.gel.play, this.thing, this);
        this.context.layoutFactory.addToBackground(button);
        accessibilify(button, this.context, this.thing);
        // ===
    }

    private thing() {
        console.log("clicked");
    }
}
