export class Startup extends Phaser.State {
    /**
     * A Genie Startup class that extends Phaser.State
     */
    constructor() {
        super();
    }

    public preload() {
        console.log("started up");
    }

    public create() {
        const style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        const text = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY,
            "- phaser -\nwith a sprinkle of\npixi dust",
            style
        );
        text.anchor.set(0.5);
    }

    /**
     * Sends params to console.log().
     * @param param The string to log.
     */
    public consoleLog(param: string) {
        console.log("Startup: " + param);
    }

    /**
     * Returns the opposite boolean
     * @param param The boolean to negate.
     */
     public negateBoolean(bool: boolean) {
         return !bool;
     }
}
