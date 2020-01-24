/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { accessibilify } from "../accessibility/accessibilify.js";

const alignmentFactor = { left: 0, center: 1, right: 2 };

export class GelGrid extends Phaser.GameObjects.Container {
    constructor(scene, metrics, safeArea, rows = 1, columns = 1) {
        super(scene, 0, 0);
        this._metrics = metrics;
        this._safeArea = safeArea;
        this._rows = rows;
        this._columns = columns;
        this._cells = [];
        this._align = scene.theme.align || "center";
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
        const colPaddingCount = this._columns - 1;
        const rowPaddingCount = this._rows - 1;
        const paddingAdjustmentX = colPaddingCount * this._cellPadding;
        const paddingAdjustmentY = rowPaddingCount * this._cellPadding;
        return [
            scaleX * ((this._safeArea.width - paddingAdjustmentX) / this._columns),
            scaleY * ((this._safeArea.height - paddingAdjustmentY) / this._rows),
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
            id: choice.id,
            key: choice.asset,
            name: choice.title ? choice.title : `option ${idx + 1}`,
            scene: this.scene.scene.key,
            channel: this.eventChannel,
            gameButton: true,
            group: "grid",
            order: 0,
            ariaLabel: choice.accessibilityText,
            accessibilityText: choice.accessibilityText,
            anim: choice.anim,
        };

        const newCell = this.scene.add.gelButton(0, 0, this._metrics, config);
        newCell.visible = Boolean(!idx);
        newCell.key = config.key;
        this._cells.push(newCell);
        this.addAt(newCell, this._cells.length);
    }

    setCellSize(cellIndex) {
        const cellSize = this.calculateCellSize();
        const spriteAspect = this._cells[cellIndex].sprite.width / this._cells[cellIndex].sprite.height;
        const cellAspect = cellSize[0] / cellSize[1];
        const axisScale = spriteAspect < cellAspect ? 0 : 1;
        const aspectRatioRatio = spriteAspect / cellAspect;

        cellSize[axisScale] *= axisScale === 0 ? aspectRatioRatio : 1 / aspectRatioRatio;
        this._cells[cellIndex].setDisplaySize(...cellSize);

        // TODO This calculation should be retained for possible inclusion of hit area adjustment,
        // currently being skipped due to unexplained behaviour with the scaling calculations.
        //
        // const hitSize = this.calculateCellSize(1 / this._cells[cellIndex].scaleX, 1 / this._cells[cellIndex].scaleY);
        // this._cells[cellIndex].input.hitArea = new Phaser.Geom.Rectangle(0, 0, hitSize[0], hitSize[1]);
    }

    setCellVisibility(cellIndex) {
        this._cells[cellIndex].visible = true;
    }

    setCellPosition(cellIndex, col, row) {
        const cellCount = this.rowCellsCount(row);
        const cell = this._cells[cellIndex];
        const cellSize = this.calculateCellSize();

        const blankPadding = cellCount * ((cell.displayWidth + this._cellPadding) / 2) * alignmentFactor[this._align];
        const paddingXTotal = col * this._cellPadding;
        const leftBound = this._safeArea.left + col * cell.displayWidth;
        const cellXCentre = cellSize[0] / 2;

        const paddingYTotal = row * this._cellPadding;
        const topBound = this._safeArea.top + row * cell.displayHeight;
        const cellYCentre = cellSize[1] / 2;

        cell.x = leftBound + paddingXTotal + cellXCentre + blankPadding;
        cell.y = topBound + cellYCentre + paddingYTotal;
    }

    removeCell(cellToRemove) {
        this._cells = fp.remove(n => n === cellToRemove, this._cells);
        cellToRemove.destroy();
    }

    setLayoutLimits() {
        const columns = this._columns;
        const rows = this._rows;
        const maxColumns = rows === 1 ? 4 : 3;
        const maxRows = 2;
        this._columns = Math.min(columns, maxColumns);
        this._rows = Math.min(maxRows, rows);
        this._cellsPerPage = this._rows * this._columns;
    }

    getBoundingRect() {
        return this._safeArea;
    }

    rowCellsCount(row) {
        let count = 0;
        while (this._cells[this.getCellIndex(row, count)] && count < this._columns) {
            count++;
        }
        return this._columns - count;
    }

    resetCell(cellIndex, col, row) {
        this.setCellSize(cellIndex, col, row);
        this.setCellPosition(cellIndex, col, row);
        this.setCellVisibility(cellIndex, col, row);
    }

    resetCells() {
        this._cells.map(cell => (cell.visible = false));
    }

    getPageCount() {
        return Math.ceil(this._cells.length / this._cellsPerPage);
    }

    nextPage() {
        this._page = (this._page + 1) % this.getPageCount();
        this.reset();
        return this._page;
    }

    getCurrentPageKey() {
        return this._cells[this._page].key;
    }

    previousPage() {
        this._page = (this._page - 1 + this.getPageCount()) % this.getPageCount();
        this.reset();
        return this._page;
    }

    getCellIndex(row, col) {
        const firstCell = this._page * this._cellsPerPage;
        return firstCell + this._columns * row + col;
    }

    reset() {
        this.resetCells();
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._columns; col++) {
                const cellIndex = this.getCellIndex(row, col);
                if (this._cells[cellIndex]) {
                    this.resetCell(cellIndex, col, row);
                }
            }
        }
    }
}
