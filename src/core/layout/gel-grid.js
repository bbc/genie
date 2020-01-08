/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { accessibilify } from "../accessibility/accessibilify.js";
import { GelButton } from "./gel-button.js";

export class GelGrid extends Phaser.GameObjects.Container {
    constructor(scene, metrics, safeArea) {
        super(scene, 0, 0);
        this._metrics = metrics;
        this._safeArea = safeArea;
        this._cells = [];
        this._columns = scene.theme.columns || 1;
        this._rows = scene.theme.rows || 1;
        this._cellPadding = metrics.isMobile ? 16 : 24;
        this.eventChannel = `gel-buttons-${scene.scene.key}`;
    }

    addGridCells() {
        this.scene.theme.choices.map((cell, idx) => {
            this.addCell(cell, idx);
        });
        this.makeAccessible();
        this.reset();
        return this._cells;
    }

    calculateCellSize() {
        const colPaddingCount = this._columns ? this._columns - 1 : 0;
        const rowPaddingCount = this._rows ? this._rows - 1 : 0;
        const paddingAdjustmentX = colPaddingCount * this._cellPadding;
        const paddingAdjustmentY = rowPaddingCount * this._cellPadding;
        return {
            width: (this._safeArea.right - this._safeArea.left - paddingAdjustmentX) / this._columns,
            height: (this._safeArea.bottom - this._safeArea.top - paddingAdjustmentY) / this._rows,
        };
    }

    resize(metrics, safeArea) {
        this._metrics = metrics || this._metrics;
        this._safeArea = safeArea || this._safeArea;
        this._cellPadding = metrics.isMobile ? 16 : 24;

        this.reset();
    }

    makeAccessible() {
        this._cells.forEach(this.makeCellAccessible, this);
    }

    makeCellAccessible(cell, idx) {
        const config = {
            id: "__" + fp.kebabCase(cell.name),
            ariaLabel: cell.name,
            group: "grid",
            title: `Selection ${idx}`,
            key: `selection_${idx}`,
            order: 0,
            channel: this.eventChannel,
        };
        cell.input.enabled = true;

        return accessibilify(cell, config, true);
    }

    cellKeys() {
        return this._cells.map(cell => cell.key);
    }

    addCell(choice, idx) {
        const config = {
            id: fp.kebabCase(choice.title),
            key: choice.asset,
            name: choice.title ? choice.title : `option ${idx + 1}`,
            scene: this.scene.scene.key,
            channel: this.eventChannel,
            gameButton: true,
            group: "grid",
            order: 0,
            ariaLabel: "",
        };

        const newCell = new GelButton(this.scene, 0, 0, this._metrics, config);
        newCell.visible = Boolean(!idx);
        newCell.key = config.key;

        this._cells.push(newCell);
        this.addAt(newCell, this._cells.length);
    }

    setCellSize(cell) {
        const cellSize = this.calculateCellSize();

        cell.displayWidth = cellSize.width;
        cell.displayHeight = cellSize.height;
    }

    setCellVisibility(cell, col, row) {
        if (row < this._rows && col < this._columns) {
            cell.visible = true;
        }
        return cell;
    }

    setCellPosition(cell, col, row) {
        const paddingXTotal = col * this._cellPadding;
        const leftBound = this._safeArea.left + col * cell.displayWidth;
        const cellXCentre = cell.displayWidth / 2;

        const paddingYTotal = row * this._cellPadding;
        const topBound = this._safeArea.top + row * cell.displayHeight;
        const cellYCentre = cell.displayHeight / 2;

        cell.x = leftBound + paddingXTotal + cellXCentre;
        cell.y = topBound + cellYCentre + paddingYTotal;
        return cell;
    }

    removeCell(cellToRemove) {
        this._cells = fp.remove(n => n === cellToRemove, this._cells);
        cellToRemove.destroy();
    }

    setLayoutLimits() {
        const columns = this._columns;
        const rows = this._rows;
        const maxColumns = rows == 1 ? 4 : 3;
        const maxRows = 2;
        this._columns = columns > maxColumns ? maxColumns : columns;
        this._rows = rows > maxRows ? maxRows : rows;
    }

    reset() {
        this.resetButtons();
    }

    resetButtons() {
        this.setLayoutLimits();

        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._columns; col++) {
                let cell = row * this._columns + col;
                this.setCellSize(this._cells[cell], col, row);
                this.setCellVisibility(this._cells[cell], col, row);
                this.setCellPosition(this._cells[cell], col, row);
            }
        }
    }
}
