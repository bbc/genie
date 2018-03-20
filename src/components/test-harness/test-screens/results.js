import { Screen } from "../../../core/screen.js";

export class ResultsTest extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.gel = this.layoutFactory.keyLookups.gel;
    }

    create() {
        const buttonPressedText = "You pressed Button " + this.context.inState.transient.buttonPressed;
        const textStyle = { font: "60px Arial", fill: "#f6931e", align: "center" };
        const gameOverText = this.game.add.text(0, -130, "Game over!", textStyle);
        const resultsText = this.game.add.text(0, -50, buttonPressedText, textStyle);
        gameOverText.anchor.set(0.5, 0.5);
        resultsText.anchor.set(0.5, 0.5);
        this.layoutFactory.addToBackground(gameOverText);
        this.layoutFactory.addToBackground(resultsText);

        const buttonKey = this.layoutFactory.keyLookups.home.basicButton;
        const buttonTextStyle = {
            font: "40px Arial",
            fill: "#fff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 223,
        };

        const goBackButtonText = new Phaser.Text(this.game, 0, 5, "Go Back", buttonTextStyle);
        const goBackButton = this.game.add.button(0, 60, buttonKey, this.next, this);
        goBackButton.addChild(goBackButtonText);
        goBackButtonText.anchor.set(0.5, 0.5);
        this.layoutFactory.addToBackground(goBackButton);
    }
}
