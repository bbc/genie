/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";

export const tweenRows = (scene, containers) => {
    containers.forEach(row => {
        const config = row.rowConfig;
        if (config.transition) {
            if (!gmi.getAllSettings().motion) {
                row.rowConfig.transition.duration = 0;
            }
            scene.add.tween({ targets: row, ...config.transition });
        }
    });
};
