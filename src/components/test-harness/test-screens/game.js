import { Screen } from "../../../core/screen.js";

export class GameTest extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.keyLookup = this.scene.keyLookups[this.game.state.current];
    }

    create() {
        const titleStyle = { font: "65px Arial", fill: "#f6931e", align: "center" };
        const titleText = this.game.add.text(0, -190, "Game goes here", titleStyle);
        titleText.anchor.set(0.5, 0.5);
        this.scene.addToBackground(titleText);
        this.scene.addLayout(["home", "pause", "audioOff", "settings"]);

        const buttonKey = this.keyLookup.basicButton;
        const buttonTextStyle = {
            font: "40px Arial",
            fill: "#fff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 223,
        };

        [-70, 20, 110].forEach((buttonYPosition, index) => {
            const buttonNumber = index + 1;
            const buttonText = new Phaser.Text(this.game, 0, 5, "Button " + buttonNumber, buttonTextStyle);
            const resultsData = { transient: { resultsData: "You pressed button " + buttonNumber } };
            const button = this.game.add.button(0, buttonYPosition, buttonKey, () => this.next(resultsData), this);
            button.anchor.set(0.5, 0.5);
            button.addChild(buttonText);
            buttonText.anchor.set(0.5, 0.5);
            this.scene.addToBackground(button);
        }, this);
    }
}
