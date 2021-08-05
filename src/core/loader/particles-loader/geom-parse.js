/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const geomObjects = {
	rectangle: config => new Phaser.Geom.Rectangle(config.x, config.y, config.width, config.height),
	circle: config => new Phaser.Geom.Circle(config.x, config.y, config.radius),
	ellipse: config => new Phaser.Geom.Ellipse(config.x, config.y, config.width, config.height),
	line: config => new Phaser.Geom.Line(config.x1, config.y1, config.x2, config.y2),
	point: config => new Phaser.Geom.Point(config.x, config.y),
	polygon: config => new Phaser.Geom.Polygon(config.points),
	triangle: config => new Phaser.Geom.Triangle(config.x1, config.y1, config.x2, config.y2, config.x3, config.y3),
};

export const geomParse = geomConfig => geomObjects[geomConfig.type](geomConfig);
