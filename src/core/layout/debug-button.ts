/**
 * Phaser button with text overlay
 *
 * @example game.add.existing(new DebugButton( ...parameters))
 */
import "phaser-ce";

const gelStyle: Phaser.PhaserTextStyle = {
    font: "ReithSans",
    fontSize: 20, //40,
    fill: "#FFFFFF",
    fontWeight: "bold",
};

interface GelSpec {
    width: number;
    height: number;
    text: string;
    click: Function;
}

export class DebugButton {
    public sprite: Phaser.Image;

    constructor(game: Phaser.Game, spec: GelSpec) {
        const backdrop = new Phaser.Graphics(game)
            .beginFill(0xf6931e)
            .drawRect(0, 0, spec.width, spec.height)
            .endFill()
            .generateTexture();

        const backdropHover = new Phaser.Graphics(game)
            .beginFill(0xffaa46, 1)
            .drawRect(0, 0, spec.width, spec.height)
            .endFill()
            .generateTexture();

        this.sprite = game.add.image(0, 0, backdrop);
        this.sprite.anchor.setTo(0.5, 0.5);

        this.sprite.inputEnabled = true;
        this.sprite.input.useHandCursor = true;

        this.sprite.events.onInputDown.add(spec.click);

        this.sprite.events.onInputOver.add(() => {
            this.sprite.setTexture(backdropHover);
        });

        this.sprite.events.onInputOut.add(() => {
            this.sprite.setTexture(backdrop);
        });

        const text = new Phaser.Text(game, 0, 0, spec.text, gelStyle);
        text.anchor.setTo(0.5, 0.5);

        this.sprite.addChild(text);
    }

    /**
     * Disables input and makes button semi-transparent
     */
    public setEnabled(bool: boolean = true) {
        this.sprite.inputEnabled = bool;
        this.sprite.alpha = bool ? 1 : 0.5;
    }
}
