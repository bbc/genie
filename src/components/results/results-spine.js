/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { gmi } from "../../core/gmi/gmi.js";

export class ResultsSpine {
    constructor(scene, config) {
        this.config = config;
        let animation;
        if (gmi.getAllSettings().motion) {
            scene.add.existing(this);
            animation = scene.add.spine(config.offsetX, config.offsetY, config.key, config.animationName, config.loop);
            config.props && Object.assign(animation, config.props);
            animation.active = gmi.getAllSettings().motion;
            animation.setSize(animation.width * config.props.scale, animation.height * config.props.scale);
        }
        return animation;
    }
}
