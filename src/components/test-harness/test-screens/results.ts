import { Screen } from "src/core/screen";

export class ResultsTest extends Screen {
    constructor() {
        super();
    }

    public preload() {}

    public create() {
        const style = { font: "65px Arial", fill: "#1d47f2", align: "center" };
        const text = this.game.add.text(0, 0, "Results Screen", style);
        text.anchor.set(0.5, 0.5);
        this.layoutFactory.addToBackground(text);
    }
}
