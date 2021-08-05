/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const throttleFor = 100;
let lastCallTime = 0;

export const getInputFn = keys => () => {
	const currentTime = Date.now();
	const sizing = keys.x.isDown;
	const slow = keys.z.isDown;
	const throttled = slow && currentTime - lastCallTime < throttleFor;

	const val = throttled ? 0 : slow ? 1 : 10;

	const xDir = keys.right.isDown - keys.left.isDown;
	const yDir = keys.down.isDown - keys.up.isDown;

	const x = sizing ? 0 : xDir * val;
	const y = sizing ? 0 : yDir * val;
	const width = sizing ? xDir * val : 0;
	const height = sizing ? yDir * val : 0;

	!throttled && (lastCallTime = currentTime);

	return { x, y, width, height };
};
