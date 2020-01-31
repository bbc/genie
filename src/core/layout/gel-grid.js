/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

import { gmi } from "../../core/gmi/gmi.js";
import { accessibilify } from "../accessibility/accessibilify.js";

const alignmentFactor = { left: 0, center: 1, right: 2 };

const defaults = {
    rows: 1,
    columns: 1,
    ease: "Cubic.easeInOut",
    duration: 500,
    align: "center",
};

export class GelGrid extends Phaser.GameObjects.Container {
    constructor(scene, metrics, safeArea, config) {
        super(scene, 0, 0);

        this._metrics = metrics;
        this._safeArea = safeArea;
        this._config = { ...defaults, ...config };
        this._cells = [];
        this._cellPadding = metrics.isMobile ? 16 : 24;
        this._page = 0;
        this.eventChannel = `gel-buttons-${scene.scene.key}`;
    }

    addGridCells(gridCells) {
        gridCells.map((cell, idx) => this.addCell(cell, idx));
        this.makeAccessible();
        this.setLayoutLimits();
        this.reset();
        return this._cells;
    }

    calculateCellSize(scaleX = 1, scaleY = 1) {
        const colPaddingCount = this._config.columns - 1;
        const rowPaddingCount = this._config.rows - 1;
        const paddingAdjustmentX = colPaddingCount * this._cellPadding;
        const paddingAdjustmentY = rowPaddingCount * this._cellPadding;
        return [
            scaleX * ((this._safeArea.width - paddingAdjustmentX) / this._config.columns),
            scaleY * ((this._safeArea.height - paddingAdjustmentY) / this._config.rows),
        ];
    }

    resize(metrics, safeArea) {
        this._metrics = metrics;
        this._safeArea = safeArea;
        this._cellPadding = metrics.screenToCanvas(metrics.isMobile ? 16 : 24);

        this.reset();
    }

    makeAccessible() {
        this._cells.forEach(this.makeCellAccessible, this);
    }

    makeCellAccessible(cell) {
        cell.input.enabled = true;

        return accessibilify(cell, true);
    }

    cellIds() {
        return this._cells.map(cell => cell.config.id);
    }

    addCell(choice, idx) {
        const config = {
            ...choice,
            scene: this.scene.scene.key,
            channel: this.eventChannel,
            gameButton: true,
            group: "grid",
            order: 0,
        };

        const newCell = this.scene.add.gelButton(0, 0, this._metrics, config);

        const transition = newKey => {
            if (this.getCurrentPageKey() === newKey) {
                return;
            }
            this.pageTransition(true);
        };

        function transitionOnTab() {
            transition(this.config.id);
        }

        newCell.on(Phaser.Input.Events.POINTER_OVER, transitionOnTab, newCell);

        newCell.visible = Boolean(!idx);
        newCell.key = config.key;
        this._cells.push(newCell);
        this.addAt(newCell, this._cells.length);
    }

    setCellSize(cell) {
        const size = [...this._cellSize];
        const spriteAspect = cell.sprite.width / cell.sprite.height;
        const cellAspect = size[0] / size[1];
        const axisScale = spriteAspect < cellAspect ? 0 : 1;
        const aspectRatioRatio = spriteAspect / cellAspect;

        size[axisScale] *= axisScale === 0 ? aspectRatioRatio : 1 / aspectRatioRatio;
        cell.setDisplaySize(...size);

        // TODO This calculation should be retained for possible inclusion of hit area adjustment,
        // currently being skipped due to unexplained behaviour with the scaling calculations.
        //
        // const hitSize = this.calculateCellSize(1 / this._cells[cellIndex].scaleX, 1 / this._cells[cellIndex].scaleY);
        // this._cells[cellIndex].input.hitArea = new Phaser.Geom.Rectangle(0, 0, hitSize[0], hitSize[1]);
    }

    setCellPosition(cell, idx) {
        const col = idx % this._config.columns;
        const row = Math.floor(idx / this._config.columns);
        const blankCellCount = Math.max(this._config.columns * (row + 1) - this.getPageCells(this._page).length, 0);

        const blankPadding =
            blankCellCount * ((cell.displayWidth + this._cellPadding) / 2) * alignmentFactor[this._config.align];

        const paddingXTotal = col * this._cellPadding;
        const leftBound = this._safeArea.left + col * cell.displayWidth;
        const cellXCentre = this._cellSize[0] / 2;

        const paddingYTotal = row * this._cellPadding;
        const topBound = this._safeArea.top + row * cell.displayHeight;
        const cellYCentre = this._cellSize[1] / 2;

        cell.x = leftBound + paddingXTotal + cellXCentre + blankPadding;
        cell.y = topBound + cellYCentre + paddingYTotal;
    }

    removeCell(cellToRemove) {
        this._cells = fp.remove(n => n === cellToRemove, this._cells);
        cellToRemove.destroy();
    }

    setLayoutLimits() {
        const maxColumns = this._config.rows === 1 ? 4 : 3;
        const maxRows = 2;
        this._config.columns = Math.min(this._config.columns, maxColumns);
        this._config.rows = Math.min(maxRows, this._config.rows);
        this._cellsPerPage = this._config.rows * this._config.columns;
    }

    getBoundingRect() {
        return this._safeArea;
    }

    resetCell(cell, idx) {
        this.setCellSize(cell);
        this.setCellPosition(cell, idx);
    }

    getPageCount() {
        return Math.ceil(this._cells.length / this._cellsPerPage);
    }

    addTweens = config => cell => {
        const edge = config.goForwards ? this._safeArea.width : -this._safeArea.width;
        const x = { from: config.tweenIn ? cell.x + edge : cell.x, to: config.tweenIn ? cell.x : cell.x - edge };
        const alpha = { from: config.tweenIn ? 0 : 1, to: config.tweenIn ? 1 : 0 };
        const duration = !gmi.getAllSettings().motion ? 0 : config.duration;

        this.scene.add.tween({ targets: cell, ease: config.ease, x, alpha, duration });
    };

    pageTransition(goForwards = true) {
        const currentPage = this._page;
        const nextPage = goForwards ? this._page + 1 : this._page - 1 + this.getPageCount();

        this._page = nextPage % this.getPageCount();
        this.reset();

        this.scene.input.enabled = false;

        this.getPageCells(this._page).forEach(this.addTweens({ ...this._config, tweenIn: true, goForwards }));
        this.getPageCells(currentPage).forEach(this.addTweens({ ...this._config, tweenIn: false, goForwards }));
        this.scene.time.addEvent({
            delay: this._config.duration + 1,
            callback: () => (this.scene.input.enabled = true),
        });
    }

    nextPage() {
        this.pageTransition();
        return this._page;
    }

    getCurrentPageKey() {
        return this._cells[this._page].key;
    }

    previousPage() {
        const goForward = false;
        this.pageTransition(goForward);
        return this._page;
    }

    showPage(pageNum, show = true) {
        this.getPageCells(pageNum).forEach(cell => (cell.visible = show));
    }

    getPageCells(pageNum) {
        const pageMax = this._cellsPerPage * (pageNum + 1);
        const pageMin = this._cellsPerPage * pageNum;
        return this._cells.filter((cell, idx) => idx >= pageMin && idx < pageMax);
    }

    reset() {
        this._cellSize = this.calculateCellSize();
        this.showPage(this._page);
        this.getPageCells(this._page).forEach(this.resetCell, this);
    }
}
