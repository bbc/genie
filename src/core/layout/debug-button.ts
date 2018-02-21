/**
 * Phaser button with text overlay
 *
 * @example game.add.existing(new DebugButton( ...parameters))
 */
const gelStyle: Phaser.PhaserTextStyle = {
    font: "ReithSans",
    fontSize: 20, //40,
    fill: "#FFFFFF",
    fontWeight: "bold",
};

const makeRect = (game: Phaser.Game, color1: number, width: number, height: number) =>
    new Phaser.Graphics(game)
        .beginFill(color1)
        .drawRect(0, 0, width, height)
        .endFill()
        .generateTexture();

export class DebugButton extends Phaser.Button {
    constructor(game: Phaser.Game, spec: GelSpec) {
        super(game);

        const backdrop = makeRect(game, 0xf6931e, spec.width, spec.height);
        const backdropHover = makeRect(game, 0xffaa46, spec.width, spec.height);
        this.texture = backdrop;

        this.animations.sprite.anchor.setTo(0.5, 0.5);
        this.onInputUp.add(spec.click, this);

        this.animations.sprite.events.onInputOver.add(() => {
            this.texture = backdropHover;
        });

        this.animations.sprite.events.onInputOut.add(() => {
            this.texture = backdrop;
        });

        const text = new Phaser.Text(game, 0, 0, spec.text, gelStyle);
        text.anchor.setTo(0.5, 0.5);
        this.animations.sprite.addChild(text);
    }

    /**
     * Disables input and makes button semi-transparent
     */
    public setEnabled(bool: boolean = true) {
        this.animations.sprite.inputEnabled = bool;
        this.animations.sprite.alpha = bool ? 1 : 0.5;
    }
}
