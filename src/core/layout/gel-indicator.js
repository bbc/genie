/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assetPath } from "./asset-paths.js";

export class Indicator extends Phaser.GameObjects.Sprite {
    constructor(gelButton) {
        super(gelButton.scene, 0, 0, assetPath({ key: "notification", isMobile: gelButton._isMobile }));
        this.scene.add.existing(this);
        this.setDepth(1);
        this.gelButton = gelButton;
        this.scale = 0;
        this.scene.add.tween({ targets: this, ease: "Bounce", delay: 500, duration: 500, scale: 1 });
    }

    resize() {
        const { x, y, width } = this.gelButton.getBounds();
        this.x = x + width - this.width / 2 + 3;
        this.y = y - 3 + this.height / 2;
        this.setTexture(assetPath({ key: "notification", isMobile: this.gelButton._isMobile }));
    }
}

export const noIndicator = {
    resize: () => {},
    destroy: () => {},
};
