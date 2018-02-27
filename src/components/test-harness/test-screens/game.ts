import { Screen } from "../../../core/screen";

export class GameTest extends Screen {
    private gel: { [key: string]: string };

    constructor() {
        super();
    }

    public preload() {
        this.gel = this.layoutFactory.keyLookups.gel;
    }

    public create() {
        const titleStyle = { font: "65px Arial", fill: "#f6931e", align: "center" };
        const titleText = this.game.add.text(0, -190, "Game goes here", titleStyle);
        titleText.anchor.set(0.5, 0.5);
        this.layoutFactory.addToBackground(titleText);

        const buttonKey = this.layoutFactory.keyLookups.home.basicButton;
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
            const buttonState = { transient: { buttonPressed: buttonNumber } };
            const button = this.game.add.button(0, buttonYPosition, buttonKey, () => this.next(buttonState), this);
            button.anchor.set(0.5, 0.5);
            button.addChild(buttonText);
            buttonText.anchor.set(0.5, 0.5);
            this.layoutFactory.addToBackground(button);
        }, this);
    }
}
