import { Screen } from "../core/screen";
import { accessibilify } from "../lib/accessibilify";
import { createTestHarnessDisplay } from "./test-harness/layout-harness";

export class Home extends Screen {
    private keyLookup: { [key: string]: string };
    private gel: { [key: string]: string };

    constructor() {
        super();
    }

    public preload() {
        this.keyLookup = this.layoutFactory.keyLookups[this.game.state.current];
        this.gel = this.layoutFactory.keyLookups.gel;
    }

    public create() {
        this.layoutFactory.addToBackground(this.game.add.image(0, 0, this.keyLookup.background));
        this.layoutFactory.addToBackground(this.game.add.image(0, -150, this.keyLookup.title));
        this.layoutFactory.addLayout(["exit", "howToPlay", "play", "soundOff", "settings"], this.gel);
        this.layoutFactory.addToBackground(this.game.add.button(0, 0, this.gel.play, () => this.next(), this)); // remove when layout handles this
        createTestHarnessDisplay(this.game, this.context, this.layoutFactory);
        // Example on how to accessibilify a standard button:
        const btn = this.game.add.button(-200, 0, this.gel.play, () => {
            this.next();
            console.log("clicked accessible button");
            btn.x = -1000;
        });
        btn.name = "accessible-button-example";
        this.layoutFactory.addToBackground(btn);
        accessibilify(btn, this.layoutFactory, "Test Accessible Button");
    }
}
