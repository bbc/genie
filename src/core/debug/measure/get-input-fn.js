/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const getInputFn = keys => () => {
    const ctrl = keys.ctrl.isDown;
    const val = keys.shift.isDown ? 10 : 1;

    const xDir = keys.right.isDown - keys.left.isDown;
    const yDir = keys.down.isDown - keys.up.isDown;

    const x = ctrl ? 0 : xDir * val;
    const y = ctrl ? 0 : yDir * val;
    const width = ctrl ? xDir * val : 0;
    const height = ctrl ? yDir * val : 0;

    return { x, y, width, height };
};
