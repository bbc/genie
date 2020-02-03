/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const tweenRows = (scene, containers) => {
    containers.forEach(row => {
        scene.add.tween({
            targets: row,
            ...row.rowConfig.transition,
        });
    });
};
