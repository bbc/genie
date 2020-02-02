/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { accessibilify } from "../../accessibility/accessibilify.js";
import { gmi } from "../../gmi/gmi.js";

const alignmentFactor = { left: 0, center: 1, right: 2 };

const defaults = {
    gameButton: true,
    group: "grid",
    order: 0,
};

const transitionOnTab = (grid, button) => () => {
    if (grid.getCurrentPageKey() === button.config.id) {
        return;
    }

    const currentIdx = grid.cellIds().indexOf(grid.getCurrentPageKey());
    const nextIdx = grid.cellIds().indexOf(button.config.id);
    grid.pageTransition(nextIdx > currentIdx);
};

export const setSize = (grid, button) => {
    const size = [...grid._cellSize];
    const spriteAspect = button.sprite.width / button.sprite.height;
    const cellAspect = size[0] / size[1];
    const axisScale = spriteAspect < cellAspect ? 0 : 1;
    const aspectRatioRatio = spriteAspect / cellAspect;

    size[axisScale] *= axisScale === 0 ? aspectRatioRatio : 1 / aspectRatioRatio;
    button.setDisplaySize(...size);

    // TODO This calculation should be retained for possible inclusion of hit area adjustment,
    // currently being skipped due to unexplained behaviour with the scaling calculations.
    //
    // const hitSize = this.calculateCellSize(1 / this._cells[cellIndex].scaleX, 1 / this._cells[cellIndex].scaleY);
    // this._cells[cellIndex].input.hitArea = new Phaser.Geom.Rectangle(0, 0, hitSize[0], hitSize[1]);
};

const setPosition = (grid, button, idx) => {
    const pageIdx = idx % grid.cellsPerPage;
    const col = pageIdx % grid._config.columns;
    const row = Math.floor(pageIdx / grid._config.columns);
    const blankCellCount = Math.max(grid._config.columns * (row + 1) - grid.getPageCells(grid._page).length, 0);

    const blankPadding =
        blankCellCount * ((button.displayWidth + grid._cellPadding) / 2) * alignmentFactor[grid._config.align];

    const paddingXTotal = col * grid._cellPadding;
    const leftBound = grid._safeArea.left + col * button.displayWidth;
    const cellXCentre = grid._cellSize[0] / 2;

    const paddingYTotal = row * grid._cellPadding;
    const topBound = grid._safeArea.top + row * button.displayHeight;
    const cellYCentre = grid._cellSize[1] / 2;

    button.x = leftBound + paddingXTotal + cellXCentre + blankPadding;
    button.y = topBound + cellYCentre + paddingYTotal;
};

export const create = (grid, choice, idx) => {
    const config = {
        ...choice,
        scene: grid.scene.scene.key,
        channel: grid.eventChannel,
        alwaysTab: grid.cellsPerPage === 1,
    };

    const button = grid.scene.add.gelButton(0, 0, grid._metrics, { ...defaults, ...config }); //TODO access private

    grid.cellsPerPage === 1 && button.on(Phaser.Input.Events.POINTER_OVER, transitionOnTab(grid, button));
    grid.cellsPerPage > 1 && (button.visible = Boolean(!idx));
    button.key = config.key;
    grid.add(button);

    const makeAccessible = () => {
        accessibilify(button, true);
    };

    const reset = () => {
        setSize(grid, button);
        setPosition(grid, button, idx);
        button.visible = false;
        button.accessibleElement.update();
    };

    const addTweens = config => {
        const edge = config.goForwards ? grid._safeArea.width : -grid._safeArea.width;
        const x = {
            from: config.tweenIn ? button.x + edge : button.x,
            to: config.tweenIn ? button.x : button.x - edge,
        };
        const alpha = { from: config.tweenIn ? 0 : 1, to: config.tweenIn ? 1 : 0 };
        const duration = !gmi.getAllSettings().motion ? 0 : config.duration;

        grid.scene.add.tween({ targets: button, ease: config.ease, x, alpha, duration });
    };

    return {
        button,
        reset,
        addTweens,
        makeAccessible,
    };
};
