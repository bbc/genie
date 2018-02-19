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

        // Example on how to accessibilify a standard button:
        const btn = this.game.add.button(-200, 0, this.gel.play, () => {
            console.log("clicked accessible button");
        });
        btn.name = "accessible-button-example";
        this.context.layoutFactory.addToBackground(btn);
        accessibilify(btn, this.context, "Test Accessible Button");
    }
}
