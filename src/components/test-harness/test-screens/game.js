import { Screen } from "../../../core/screen.js";

export class GameTest extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.keyLookup = this.layoutFactory.keyLookups[this.game.state.current];
    }

    create() {
        const titleStyle = { font: "65px Arial", fill: "#f6931e", align: "center" };
        const titleText = this.game.add.text(0, -190, "Game goes here", titleStyle);
        titleText.anchor.set(0.5, 0.5);
        this.layoutFactory.addToBackground(titleText);
        this.layoutFactory.addLayout(["home", "pause", "audioOff", "settings"]);

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
            const results = {
                results: "You pressed button " + buttonNumber,
                characterSelected: this.transientData.characterSelected,
            };
            const button = this.game.add.button(
                0,
                buttonYPosition,
                buttonKey,
                () => this.navigation.next(results),
                this,
            );
            button.anchor.set(0.5, 0.5);
            button.addChild(buttonText);
            buttonText.anchor.set(0.5, 0.5);
            this.layoutFactory.addToBackground(button);
        }, this);

        const characterSelectedText = this.game.add.text(
            0,
            200,
            "Character Selected: " + this.transientData.characterSelected,
            { font: "32px Arial", fill: "#f6931e", align: "center" },
        );
        this.layoutFactory.addToBackground(characterSelectedText);
    }
}
