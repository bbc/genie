/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { ResultsRow } from "../../components/results/results-row.js";

export const RowType = {
    Results: ResultsRow,
};

export function create(scene, getArea, rowsConfig, rowType) {
    let containers = [];

    const createRow = (rowConfig, index) => {
        const container = new rowType(scene, rowConfig, getRectForRow(index));
        containers.push(container);
        scene.layout.addCustomGroup(`row-${index}`, container);
    };

    const getRectForRow = index => () => {
        const drawArea = getArea();
        const numberOfRows = rowsConfig.length;
        const rowHeight = drawArea.height / numberOfRows;
        const topOfRow = drawArea.y + rowHeight * index;

        return new Phaser.Geom.Rectangle(drawArea.x, topOfRow, drawArea.width, rowHeight);
    };

    const rowTransitions = () => {
        containers.forEach(row => {
            scene.add.tween({
                targets: row,
                ...row.rowConfig.transition,
            });
            if (row.rowConfig.audio) {
                delayedAudio(row.rowConfig);
            }
        });
    };

    // Audio delays arent paused when we add an overlay.
    // Use a scene.time event to count down to the audio timer add it here and call it in row-transitions.
    const delayedAudio = rowConfig => {
        scene.time.addEvent({
            delay: rowConfig.audio.delay,
            callback: () => scene.sound.play(rowConfig.audio.key),
        });
    };

    rowsConfig.forEach((rowConfig, index) => createRow(rowConfig, index));

    return {
        containers,
        getRectForRow,
        rowTransitions,
    };
}
