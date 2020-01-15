/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";
import { Screen } from "../../core/screen.js";
import { accessibilify } from "../../core/accessibility/accessibilify.js";

export class GameTest extends Screen {
    create() {
        this.add.image(0, 0, "home.background");
        this.addAnimations();
        this.add
            .text(0, -190, "Game goes here", {
                font: "65px ReithSans",
                fill: "#f6931e",
                align: "center",
            })
            .setOrigin(0.5);
        this.setLayout(["pause"]);

        const buttonKey = `${this.scene.key}.basicButton`;
        const buttonTextStyle = {
            font: "40px ReithSans",
            fill: "#fff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 223,
        };

        [-70, 20, 110].forEach((buttonYPosition, index) => {
            const buttonNumber = index + 1;
            const buttonText = "Button " + buttonNumber;
            const buttonConfig = { id: buttonNumber, ariaLabel: buttonText };
            const button = this.add
                .image(0, buttonYPosition, buttonKey)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on("pointerup", () => onGameComplete(buttonNumber));
            this.add
                .text(0, buttonYPosition, buttonText, buttonTextStyle)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on("pointerup", () => onGameComplete(buttonNumber));
            accessibilify(button, buttonConfig);
        }, this);

        const onGameComplete = buttonNumber => {
            const results = "You pressed button " + buttonNumber;
            gmi.setGameData("buttonPressed", buttonNumber);
            console.log("Data saved to GMI:", gmi.getAllSettings().gameData); // eslint-disable-line no-console
            this.transientData.results = results;
            this.navigation.next();
        };

        this.add
            .text(0, 200, `Character Selected: ${this.transientData["character-select"].choice.title}`, {
                font: "32px ReithSans",
                fill: "#f6931e",
                align: "center",
            })
            .setOrigin(0.5);
    }
}
