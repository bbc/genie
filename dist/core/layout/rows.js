/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsRow } from "../../components/results/results-row.js";
import { accessibilify } from "../accessibility/accessibilify.js";
export var RowType = {
  Results: ResultsRow
};
export function create(scene, getArea, rowsConfig, rowType) {
  var containers = [];

  var createRow = function createRow(rowConfig, index) {
    var container = new rowType(scene, rowConfig, getRectForRow(index));
    container.config.id = "row-".concat(index);
    containers.push(container);
    accessibilify(container, false, false);
    scene.layout.addCustomGroup("row-".concat(index), container);
  };

  var getRectForRow = function getRectForRow(index) {
    return function () {
      var drawArea = getArea();
      var numberOfRows = rowsConfig.length;
      var rowHeight = drawArea.height / numberOfRows;
      var topOfRow = drawArea.y + rowHeight * index;
      return new Phaser.Geom.Rectangle(drawArea.x, topOfRow, drawArea.width, rowHeight);
    };
  };

  rowsConfig.forEach(function (rowConfig, index) {
    return createRow(rowConfig, index);
  });
  return {
    containers: containers,
    getRectForRow: getRectForRow
  };
}