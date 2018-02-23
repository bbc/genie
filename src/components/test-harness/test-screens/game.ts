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

        const button1Text = new Phaser.Text(this.game, 0, 5, "Button 1", buttonTextStyle);
        const button1 = this.game.add.button(
            0,
            -70,
            buttonKey,
            () => this.next({ transient: { buttonPressed: 1 } }),
            this,
        );
        button1.addChild(button1Text);
        button1Text.anchor.set(0.5, 0.5);

        const button2Text = new Phaser.Text(this.game, 0, 5, "Button 2", buttonTextStyle);
        const button2 = this.game.add.button(
            0,
            20,
            buttonKey,
            () => this.next({ transient: { buttonPressed: 2 } }),
            this,
        );
        button2.addChild(button2Text);
        button2Text.anchor.set(0.5, 0.5);

        const button3Text = new Phaser.Text(this.game, 0, 5, "Button 3", buttonTextStyle);
        const button3 = this.game.add.button(
            0,
            110,
            buttonKey,
            () => this.next({ transient: { buttonPressed: 3 } }),
            this,
        );
        button3.addChild(button3Text);
        button3Text.anchor.set(0.5, 0.5);

        this.layoutFactory.addToBackground(button1);
        this.layoutFactory.addToBackground(button2);
        this.layoutFactory.addToBackground(button3);
    }
}
