/**
 * Enforces the correct configuration when one cell per page is set
 *
 * @module components/select/single-item-mode
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as a11y from "../../core/accessibility/accessibility-layer.js";

export const create = scene => {
    const continueButton = scene.layout.buttons.continue;
    if (!continueButton) return false;

    a11y.removeButton(continueButton);
    a11y.removeButton(scene.layout.buttons.next);
    a11y.removeButton(scene.layout.buttons.previous);
    a11y.reset();

    scene._cells.map(cell => cell.button.accessibleElement.update());

    continueButton.on("pointerover", () => scene.grid.getPageCells(scene.grid.page)[0].button.sprite.setFrame(1));
    continueButton.on("pointerout", () => scene.grid.getPageCells(scene.grid.page)[0].button.sprite.setFrame(0));

    scene._cells.map(cell => {
        cell.button.on("pointerover", () => continueButton.sprite.setFrame(1));
        cell.button.on("pointerout", () => continueButton.sprite.setFrame(0));
    });

    const lastCell = [scene._cells[scene._cells.length - 1]].filter(x => x);
    lastCell.map(cell => cell.button.on("pointerout", () => scene.grid.showPage(scene.grid.page + 1)));

    return true;
};

export const continueBtn = scene => (scene.theme.rows * scene.theme.columns === 1 ? ["continue"] : []);
