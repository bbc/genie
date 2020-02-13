/**
 * Enforces the correct configuration when one cell per page is set
 *
 * @module components/select/single-item-mode
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as a11y from "../../core/accessibility/accessibility-layer.js";

const currentCellIsLast = scene => scene.grid.getCurrentPageKey() === scene._cells[scene._cells.length - 1].button.key;

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
        cell.button.config.tabbable = true;
        cell.button.accessibleElement.update();
    });

    const goToStart = event => {
        if (event.key === "Tab" && !event.shiftKey && currentCellIsLast(scene)) {
            scene.grid.showPage(0);
        }
    };

    document.addEventListener("keydown", goToStart);

    const shutdown = () => {
        document.removeEventListener("keydown", goToStart);
    };

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, shutdown);

    return true;
};

export const continueBtn = scene => (scene.theme.rows * scene.theme.columns === 1 ? ["continue"] : []);
