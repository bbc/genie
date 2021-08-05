/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { geomParse } from "../../../../src/core/loader/particles-loader/geom-parse.js";

describe("Geom Parse File", () => {
	afterEach(() => jest.clearAllMocks());

	test("returns a rectangle when one is provided in config", () => {
		const config = { type: "rectangle", x: 23, y: 123, width: 32, height: 10 };
		expect(geomParse(config)).toEqual(new Phaser.Geom.Rectangle(config.x, config.y, config.width, config.height));
	});

	test("returns a circle when one is provided in config", () => {
		const config = { type: "circle", x: 1, y: 1223, radius: 10 };
		expect(geomParse(config)).toEqual(new Phaser.Geom.Circle(config.x, config.y, config.radius));
	});

	test("returns a ellipse when one is provided in config", () => {
		const config = { type: "ellipse", x: 123, y: 23, width: 12, height: 13 };
		expect(geomParse(config)).toEqual(new Phaser.Geom.Ellipse(config.x, config.y, config.width, config.height));
	});

	test("returns a line when one is provided in config", () => {
		const config = { type: "line", x1: 2, y1: 3, x2: 12, y2: 13 };
		expect(geomParse(config)).toEqual(new Phaser.Geom.Line(config.x1, config.y1, config.x2, config.y2));
	});

	test("returns a point when one is provided in config", () => {
		const config = { type: "point", x: 0, y: -2 };
		expect(geomParse(config)).toEqual(new Phaser.Geom.Point(config.x, config.y));
	});

	test("returns a polygon when one is provided in config", () => {
		const config = {
			type: "polygon",
			points: [
				{ x: 2, y: 3 },
				{ x: 4, y: 6 },
				{ x: 0, y: 3 },
				{ x: 2, y: 3 },
			],
		};
		expect(geomParse(config)).toEqual(new Phaser.Geom.Polygon(config.points));
	});

	test("returns a triangle when one is provided in config", () => {
		const config = { type: "triangle", x1: 2, y1: 3, x2: 12, y2: 13, x3: 15, y3: 7 };
		expect(geomParse(config)).toEqual(
			new Phaser.Geom.Triangle(config.x1, config.y1, config.x2, config.y2, config.x3, config.y3),
		);
	});
});
