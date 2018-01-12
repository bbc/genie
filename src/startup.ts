export default class Startup extends Phaser.State {
    constructor() {
        super();
    }

    public preload() {
        console.log("started up");
    }
}
