/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../../core/gmi/gmi.js";
import { Screen } from "../../../core/screen.js";
import { accessibilify } from "../../../core/accessibility/accessibilify.js";

export class GameTest extends Screen {
    constructor() {
        super();
    }

    create() {
        this.scene.addToBackground(this.game.add.image(0, 0, "home.background"));

        const titleStyle = { font: "65px ReithSans", fill: "#f6931e", align: "center" };
        const titleText = this.game.add.text(0, -190, "Game goes here", titleStyle);
        titleText.anchor.set(0.5, 0.5);
        this.scene.addToBackground(titleText);
        this.scene.addLayout(["pause"]);

        gmi.setGameData("characterSelected", this.transientData.characterSelected);
        console.log("Data saved to GMI:", gmi.getAllSettings().gameData); // eslint-disable-line no-console

        const buttonKey = this.getAsset("basicButton");
        const buttonTextStyle = {
            font: "40px ReithSans",
            fill: "#fff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 223,
        };

        [-70, 20, 110].forEach((buttonYPosition, index) => {
            const buttonNumber = index + 1;
            const buttonText = new Phaser.Text(this.game, 0, 5, "Button " + buttonNumber, buttonTextStyle);
            const button = this.game.add.button(
                0,
                buttonYPosition,
                buttonKey,
                () => onGameComplete(buttonNumber),
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

        const onGameComplete = buttonNumber => {
            const results = {
                results: "You pressed button " + buttonNumber,
                characterSelected: this.transientData.characterSelected,
            };
            gmi.setGameData("buttonPressed", buttonNumber);
            console.log("Data saved to GMI:", gmi.getAllSettings().gameData); // eslint-disable-line no-console
            this.navigation.next(results);
        };

        const characterSelectedText = this.game.add.text(
            0,
            200,
            "Character Selected: " + this.transientData.characterSelected,
            { font: "italic 32px ReithSans", fill: "#f6931e", align: "center" },
        );

        this.scene.addToBackground(characterSelectedText);
    }
}
