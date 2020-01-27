/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export class ResultsSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, spriteConfig) {
        super(scene, 0, 0, spriteConfig.key, spriteConfig.frame);
        this.spriteConfig = spriteConfig;
        this.setOrigin(0, 0);
    }
}
