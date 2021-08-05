/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const limit = val => (val < 1 ? 1 : val);

export const rectUpdateFn = (rect, updateCoords) => size => {
	rect.x += size.x;
	rect.y += size.y;
	rect.width = limit(rect.width + size.width);
	rect.height = limit(rect.height + size.height);
	rect.geom.width = rect.width;
	rect.geom.height = rect.height;

	rect.updateDisplayOrigin();
	rect.updateData();

	rect.input.hitArea = rect.geom;

	updateCoords(rect);
};
