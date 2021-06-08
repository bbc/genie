/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var geomObjects = {
  rectangle: function rectangle(config) {
    return new Phaser.Geom.Rectangle(config.x, config.y, config.width, config.height);
  },
  circle: function circle(config) {
    return new Phaser.Geom.Circle(config.x, config.y, config.radius);
  },
  ellipse: function ellipse(config) {
    return new Phaser.Geom.Ellipse(config.x, config.y, config.width, config.height);
  },
  line: function line(config) {
    return new Phaser.Geom.Line(config.x1, config.y1, config.x2, config.y2);
  },
  point: function point(config) {
    return new Phaser.Geom.Point(config.x, config.y);
  },
  polygon: function polygon(config) {
    return new Phaser.Geom.Polygon(config.points);
  },
  triangle: function triangle(config) {
    return new Phaser.Geom.Triangle(config.x1, config.y1, config.x2, config.y2, config.x3, config.y3);
  }
};
export var geomParse = function geomParse(geomConfig) {
  return geomObjects[geomConfig.type](geomConfig);
};