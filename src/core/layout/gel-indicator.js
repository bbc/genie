/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assetPath } from "./asset-paths.js";

export class Indicator extends Phaser.GameObjects.Sprite {
	constructor(gelButton) {
		super(gelButton.scene, 0, 0, assetPath({ key: "notification", isMobile: gelButton.isMobile }));
		this.scene.add.existing(this);
		this.setDepth(1);
		this.gelButton = gelButton;
		this.scale = 0;
		this.scene.add.tween({ targets: this, ease: "Bounce", delay: 500, duration: 500, scale: 1 });
	}

	resize() {
		const { height, width, isMobile } = this.gelButton;
		const mobOrDesk = isMobile ? "mobile" : "desktop";
		const offsets = this.gelButton.config.indicator.offsets[mobOrDesk];

		this.x = width / 2 + offsets.x;
		this.y = -height / 2 + offsets.y;
		this.setTexture(assetPath({ key: "notification", isMobile }));
	}
}
