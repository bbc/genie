/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { gmi } from "../../core/gmi/gmi.js";

export class ResultsSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, config) {
        super(scene, 0, 0, config.key, config.frame);
        this.config = config;
        this.setOrigin(0, 0);

        if (config.anim) {
            scene.add.existing(this);
            if (gmi.getAllSettings().motion) {
                scene.anims.create({
                    ...config.anim,
                    key: config.key,
                    frames: scene.anims.generateFrameNumbers(config.key, config.anim.frames),
                });
                this.play(config.key);
            }
        }
    }
}
