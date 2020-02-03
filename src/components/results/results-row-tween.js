/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const tweenRows = (scene, containers) => {
    containers.forEach(row => {
        const config = row.rowConfig;
        if (config.transition) {
            scene.add.tween({
                targets: row,
                ...config.transition,
            });
        }
    });
};
