import { testHarnessDisplay } from "src/components/test-harness/layout";
import { ScreenMap } from "src/core/asset-loader";
import * as Scaler from "src/core/scaler";
import { Screen } from "src/core/screen";

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
        testHarnessDisplay(this.game, this.context).create();
    }
}
