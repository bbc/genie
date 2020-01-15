/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { ResultsRow } from "./rows/results-row.js";

export const RowType = {
    Results: ResultsRow,
};

export function create(scene, rowsConfig, rowType) {
    let containers = [];

    const getRectForRow = index => () => {
        const drawArea = scene.layout.getSafeArea();
        const numberOfRows = rowsConfig.length;
        const rowHeight = drawArea.height / numberOfRows;
        const topOfRow = drawArea.y + rowHeight * index;

        return new Phaser.Geom.Rectangle(drawArea.x, topOfRow, drawArea.width, rowHeight);
    };

    const addRow = (rowConfig, index) => containers.push(new rowType(scene, rowConfig, getRectForRow(index)));
    rowsConfig.forEach((rowConfig, index) => addRow(rowConfig, index));

    return {
        containers,
    };
}
