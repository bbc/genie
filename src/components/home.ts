import { createTestHarnessDisplay } from "src/components/test-harness/layout-harness";
import { Screen } from "src/core/screen";

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
        this.layoutFactory.addToBackground(this.game.add.button(0, 0, this.gel.play)); // remove when layout handles this
        this.layoutFactory.addLayout(["exit", "howToPlay", "play", "soundOff", "settings"], this.gel);
        createTestHarnessDisplay(this.game, this.context, this.layoutFactory);
    }
}
