import { Screen } from "../../../core/screen";

export class GameTest extends Screen {
    private gel: { [key: string]: string };

    constructor() {
        super();
    }

    public preload() {
        this.gel = this.layoutFactory.keyLookups.gel;
    }

    public create() {
        const style = { font: "65px Arial", fill: "#f6931e", align: "center" };
        const text = this.game.add.text(0, -150, "Game goes here", style);
        text.anchor.set(0.5, 0.5);
        this.layoutFactory.addToBackground(text);
        this.layoutFactory.addToBackground(
            this.game.add.button(0, 0, this.gel.play, this.context.sequencer.next, this),
        );
    }
}
