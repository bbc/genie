/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../../core/gmi/gmi.js";
import { Screen } from "../../../core/screen.js";
// import { accessibilify } from "../../../core/accessibility/accessibilify.js";

export class GameTest extends Screen {
    constructor() {
        super({ key: "game" });
    }

    create() {
        this.add.image(0, 0, `${this.scene.key}.background`);
        const title = this.add.text(0, -190, "Game goes here", {
            font: "65px ReithSans",
            fill: "#f6931e",
            align: "center",
        });
        title.setOrigin(0.5);
        this.addLayout(["pause"]);

        gmi.setGameData("characterSelected", this.data.characterSelected);
        console.log("Data saved to GMI:", gmi.getAllSettings().gameData); // eslint-disable-line no-console

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
            this.add
                .image(0, buttonYPosition, buttonKey)
                .setOrigin(0.5)
                .setInteractive()
                .on("pointerdown", () => onGameComplete(buttonNumber));
            this.add
                .text(0, buttonYPosition, "Button " + buttonNumber, buttonTextStyle)
                .setOrigin(0.5)
                .setInteractive()
                .on("pointerdown", () => onGameComplete(buttonNumber));

            // const button = this.add.button(0, buttonYPosition, buttonKey, () => onGameComplete(buttonNumber), this);
            // const config = {
            //     id: buttonNumber,
            //     ariaLabel: buttonText,
            // };
            // TODO P3
            // accessibilify(button, config);
            // button.addChild(buttonText);
            // this.add(button);
        }, this);

        // const onGameComplete = buttonNumber => {
        //     const results = {
        //         results: "You pressed button " + buttonNumber,
        //         characterSelected: this.transientData.characterSelected,
        //     };
        //     gmi.setGameData("buttonPressed", buttonNumber);
        //     console.log("Data saved to GMI:", gmi.getAllSettings().gameData); // eslint-disable-line no-console
        //     this.navigation.next(results);
        // };
        //
        // this.add
        //     .text(0, 200, "Character Selected: " + this.context.transientData.characterSelected, {
        //         font: "italic 32px ReithSans",
        //         fill: "#f6931e",
        //         align: "center",
        //     })
        //     .setOrigin(0.5);
    }
}
