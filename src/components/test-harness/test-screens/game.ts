import { Screen } from "src/core/screen";

export class GameTest extends Screen {
    constructor() {
        super();
    }

    public preload() {}

    public create() {
        const style = { font: "65px Arial", fill: "#1d47f2", align: "center" };
        const text = this.game.add.text(0, 0, "Game goes here", style);
        text.anchor.set(0.5, 0.5);
        this.layoutFactory.addToBackground(text);

        //this.layout = layoutFactory.create(["exit", "achievement"], {});
    }
}
