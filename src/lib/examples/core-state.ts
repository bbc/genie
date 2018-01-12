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

    /**
     * Sends params to console.log().
     * @param param The string to log.
     */
    public consoleLog(param: string) {
        console.log("Startup: " + param);
    }
}
