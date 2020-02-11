/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../core/screen.js";
import { accessibilify } from "../core/accessibility/accessibilify.js";

export class Game extends Screen {
    create() {
        let keys = 0;
        let gems = 0;
        let stars = 0;
        this.add.image(0, 0, "home.background");
        this.addAnimations();
        this.add
            .text(0, -190, "Test Game: Collect Items", {
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

        const buttonNames = ["Star", "Gem", "Key"];

        this.add.image(0, -70, `${this.scene.key}.star`);
        this.add.image(0, 20, `${this.scene.key}.gem`);
        this.add.image(0, 110, `${this.scene.key}.key`);
        const starScore = this.add.text(-50, -70, "0", buttonTextStyle).setOrigin(0.5);
        const gemScore = this.add.text(-50, 20, "0", buttonTextStyle).setOrigin(0.5);
        const keyScore = this.add.text(-50, 110, "0", buttonTextStyle).setOrigin(0.5);

        this.add
            .image(300, 20, buttonKey)
            .setOrigin(0.5)

            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => onGameComplete());
        this.add
            .text(300, 20, "Continue", buttonTextStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => onGameComplete());

        [-70, 20, 110].forEach((buttonYPosition, index) => {
            const buttonNumber = index + 1;
            const buttonText = "Collect " + buttonNames[index];
            const button = this.add
                .image(-200, buttonYPosition, buttonKey)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on("pointerup", () => increaseScores(index));
            this.add
                .text(-200, buttonYPosition, buttonText, buttonTextStyle)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on("pointerup", () => increaseScores(index));
            button.config = { id: buttonNumber, ariaLabel: buttonText };
            accessibilify(button);
        }, this);

        const onGameComplete = () => {
            this.transientData.results = { keys, gems, stars };
            this.navigation.next();
        };

        const increaseScores = index => {
            if (index == 0) {
                stars++;
                starScore.text = stars;
            }
            if (index == 1) {
                gems++;
                gemScore.text = gems;
            }
            if (index == 2) {
                keys++;
                keyScore.text = keys;
            }
        };

        this.add
            .text(0, 200, `Character Selected: ${this.transientData["character-select"].choice.title}`, {
                font: "32px ReithSans",
                fill: "#f6931e",
                align: "center",
            })
            .setOrigin(0.5);
        this.add
            .text(0, 250, `Level Selected: ${this.transientData["level-select"].choice.title}`, {
                font: "32px ReithSans",
                fill: "#f6931e",
                align: "center",
            })
            .setOrigin(0.5);
    }
}
