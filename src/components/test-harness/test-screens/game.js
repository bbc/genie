import { Screen } from "../../../core/screen.js";
import { accessibilify } from "../../../core/accessibilify/accessibilify.js";

export class GameTest extends Screen {
    constructor() {
        super();
    }

    create() {
        const titleStyle = { font: "65px Arial", fill: "#f6931e", align: "center" };
        const titleText = this.game.add.text(0, -190, "Game goes here", titleStyle);
        titleText.anchor.set(0.5, 0.5);
        this.scene.addToBackground(titleText);
        this.scene.addLayout(["pause"]);

        const buttonKey = this.getAsset("basicButton");
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
            const config = {
                id: buttonNumber,
                ariaLabel: buttonText,
            };
            accessibilify(button, config);
            button.anchor.set(0.5, 0.5);
            button.addChild(buttonText);
            buttonText.anchor.set(0.5, 0.5);
            this.scene.addToBackground(button);
        }, this);

        const characterSelectedText = this.game.add.text(
            0,
            200,
            "Character Selected: " + this.transientData.characterSelected,
            { font: "32px Arial", fill: "#f6931e", align: "center" },
        );
        this.scene.addToBackground(characterSelectedText);
    }
}
