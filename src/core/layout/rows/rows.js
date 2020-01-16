/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { ResultsRow } from "./results-row.js";

export const RowType = {
    Results: ResultsRow,
};

export function create(scene, rowsConfig, rowType) {
    let containers = [];

    const createRow = (rowConfig, index) => {
        const container = new rowType(scene, rowConfig, getRectForRow(index));
        containers.push(container);
        scene.layout.addCustomGroup(`row-${index}`, container);
    };

    const getRectForRow = index => () => {
        const drawArea = scene.layout.getSafeArea();
        const numberOfRows = rowsConfig.length;
        const rowHeight = drawArea.height / numberOfRows;
        const topOfRow = drawArea.y + rowHeight * index;

        return new Phaser.Geom.Rectangle(drawArea.x, topOfRow, drawArea.width, rowHeight);
    };

    rowsConfig.forEach((rowConfig, index) => createRow(rowConfig, index));

    return {
        containers,
        getRectForRow,
    };
}
