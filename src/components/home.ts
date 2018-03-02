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
    }

    public create() {
        this.layoutFactory.addToBackground(this.game.add.image(0, 0, this.keyLookup.background));
        this.layoutFactory.addToBackground(this.game.add.image(0, -150, this.keyLookup.title));
        this.layoutFactory.addLayout(["exit", "howToPlay", "play", "audioOff", "settings"]);
        createTestHarnessDisplay(this.game, this.context, this.layoutFactory);

        // Example on how to accessibilify a standard button:
        // const btn = this.game.add.button(-200, 0, this.gel.play, () => {
        //     console.log("clicked accessible button");
        // });
        // btn.name = "accessible-button-example";
        // this.layoutFactory.addToBackground(btn);
        // accessibilify(btn, this.layoutFactory, "Test Accessible Button");
    }
}
