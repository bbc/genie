/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../../lib/lodash/fp/fp.js";

import { accessibilify } from "../../accessibility/accessibilify.js";
import { gmi } from "../../gmi/gmi.js";
import * as state from "../../state.js";

const alignmentFactor = { left: 0, center: 1, right: 2 };

const defaults = {
    gameButton: true,
    group: "grid",
    order: 0,
};

const transitionOnTab = (grid, button) => () => {
    if (grid.getCurrentPageKey() === button.config.id) return;
    const nextIdx = grid.cellIds().indexOf(button.config.id);
    grid.showPage(nextIdx);
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

const getBlankCellCount = (grid, row, page) => {
    return Math.max(grid._config.columns * (row + 1) - grid.getPageCells(page).length, 0);
};

const setPosition = (grid, button, idx) => {
    const pageIdx = idx % grid.cellsPerPage;
    const page = Math.floor(idx / grid.cellsPerPage);
    const col = pageIdx % grid._config.columns;
    const row = Math.floor(pageIdx / grid._config.columns);

    const positionFactorX = col - (grid._config.columns - 1) / 2;
    const positionFactorY = row - (grid._config.rows - 1) / 2;

    const alignmentX =
        (button.displayWidth + grid._cellPadding) *
        0.5 *
        getBlankCellCount(grid, row, page) *
        alignmentFactor[grid._config.align];
    button.x = positionFactorX * button.displayWidth + positionFactorX * grid._cellPadding + alignmentX;
    button.y = button.displayHeight * positionFactorY + grid._cellPadding * positionFactorY;
};

const getStates = theme => {
    const stateConfig = theme.choices.map(({ id, state }) => ({ id, state }));
    return state.create(theme.storageKey, stateConfig);
};

const getStylingForState = (btn, states, styling) => styling[fp.get("state", states.get(btn.key))] || {};

const getStyles = (btn, theme) => {
    const states = getStates(theme);
    const defaultStyles = theme.choicesStyling.default;
    const stylesOverride = getStylingForState(btn, states, theme.choicesStyling);
    return fp.merge(defaultStyles, stylesOverride);
};

const addTextToScene = (scene, styles, text, btn, key) => {
    const textOnScene = scene.add.text(styles.position.x, styles.position.y, text, styles.style);
    textOnScene.setOrigin(0.5, 0.5);
    btn.overlays.set(key, textOnScene);
};

const addTextToButton = (scene, config, btn, theme) => {
    const styles = getStyles(btn, theme);
    addTextToScene(scene, styles.title, config.title, btn, "titleText");

    if (config.subtitle && styles.subtitle) {
        addTextToScene(scene, styles.subtitle, config.subtitle, btn, "subtitleText");
    }
};

export const createCell = (grid, choice, idx, theme) => {
    const config = {
        ...choice,
        scene: grid.scene.scene.key,
        channel: grid.eventChannel,
        tabbable: false,
    };

    const button = grid.scene.add.gelButton(0, 0, { ...defaults, ...config });
    grid.cellsPerPage === 1 && button.on(Phaser.Input.Events.POINTER_OVER, transitionOnTab(grid, button));
    grid.cellsPerPage > 1 && (button.visible = Boolean(!idx));
    button.key = config.key;

    if (fp.get("choicesStyling.default", theme)) {
        addTextToButton(grid.scene, config, button, theme);
    }
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
