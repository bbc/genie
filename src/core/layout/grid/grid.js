/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createCell } from "./cell.js";
import * as a11y from "../../accessibility/accessibility-layer.js";
import { getMetrics } from "../../scaler.js";

const defaults = {
	rows: 1,
	columns: 1,
	ease: "Cubic.easeInOut",
	duration: 500,
	align: "center",
	onTransitionStart: () => {},
};

const resetCell = cell => cell.reset();

export class GelGrid extends Phaser.GameObjects.Container {
	constructor(scene, config) {
		super(scene, 0, 0);

		const metrics = getMetrics();
		this._safeArea = scene.layout.getSafeArea(metrics);
		this._config = { ...defaults, ...config };
		this._cells = [];
		this._cellPadding = metrics.isMobile ? 16 : 24;
		this.page = 0;
		this.eventChannel = `gel-buttons-${scene.scene.key}`;
		this.enforceLimits();
	}

	addGridCells(choices) {
		this.page = this.getCellPage(choices, this._config.choice);
		this._cells = choices.map((cell, idx) => createCell(this, cell, idx, this._config));
		this._cells.forEach(cell => this.add(cell.button));
		this.makeAccessible();
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

	resize(safeArea) {
		const metrics = getMetrics();
		this._safeArea = safeArea;
		this._cellPadding = metrics.screenToCanvas(metrics.isMobile ? 16 : 24);
		this.reset();
	}

	cellIds() {
		return this._cells.map(cell => cell.button.config.id);
	}

	choices() {
		return this._cells.map(cell => {
			return { title: cell.button.config.title, id: cell.button.config.id };
		});
	}

	getCurrentSelection() {
		return this.choices()[this.page];
	}

	enforceLimits() {
		const maxColumns = this._config.rows === 1 ? 4 : 3;
		const maxRows = 2;
		this._config.columns = Math.min(this._config.columns, maxColumns);
		this._config.rows = Math.min(maxRows, this._config.rows);
		this.cellsPerPage = this._config.rows * this._config.columns;
	}

	getBoundingRect() {
		return this._safeArea;
	}

	getPageCount() {
		return Math.ceil(this._cells.length / this.cellsPerPage);
	}

	makeAccessible() {
		a11y.addGroupAt("grid", this._config.tabIndex);
		this._cells.forEach(cell => cell.makeAccessible());
		this.reset();
	}

	shouldGoForwards(nextPageNum, currentPage, pageCount) {
		const isSingleItem = this._config.columns === 1 && this._config.rows === 1;
		if (isSingleItem) {
			const isFirstPageLoopingBackwards = pageCount === nextPageNum + 1 && currentPage === 0;
			const isLastPageLoopingForwards = pageCount === currentPage + 1 && nextPageNum === 0;
			if (isFirstPageLoopingBackwards) {
				return false;
			}
			if (isLastPageLoopingForwards) {
				return true;
			}
		}
		return nextPageNum > currentPage;
	}

	showPage(pageNum) {
		const pageCount = this.getPageCount();
		const nextPageNum = (pageNum + pageCount) % pageCount;
		if (this.page === nextPageNum) return;

		const currentPage = this.page;
		const goForwards = this.shouldGoForwards(pageNum, currentPage, pageCount);
		this.page = nextPageNum;

		this.reset();
		this.setPageVisibility(currentPage, true);
		this.scene.input.enabled = false;
		this._config.onTransitionStart();

		this.getPageCells(this.page).forEach(cell => cell.addTweens({ ...this._config, tweenIn: true, goForwards }));
		this.getPageCells(currentPage).forEach(cell => cell.addTweens({ ...this._config, tweenIn: false, goForwards }));
		this.scene.time.addEvent({
			delay: this._config.duration + 1,
			callback: this.transitionCallback,
			callbackScope: this,
			args: [currentPage],
		});
	}

	transitionCallback(pageToDisable) {
		if (this.page === pageToDisable) {
			return;
		}
		this.setPageVisibility(pageToDisable, false);
		this.scene.input.enabled = true;
	}

	getCurrentPageId() {
		return this._cells[this.page].button.config.id;
	}

	setPageVisibility(pageNum, visibility) {
		this.getPageCells(pageNum).forEach(cell => {
			cell.button.visible = visibility;
			this.cellsPerPage > 1 && (cell.button.config.tabbable = visibility);
			cell.button.accessibleElement.update();
		});
	}

	getPageCells(pageNum) {
		const pageMax = this.cellsPerPage * (pageNum + 1);
		const pageMin = this.cellsPerPage * pageNum;
		return this._cells.filter((cell, idx) => idx >= pageMin && idx < pageMax);
	}

	getCellPage(choices, cellId = 0) {
		const cellIdx = Math.max(
			choices.findIndex(cell => cell.id === cellId),
			0,
		);
		return Math.floor(cellIdx / this.cellsPerPage);
	}

	reset() {
		this._cellSize = this.calculateCellSize();
		this._cells.forEach(resetCell);
		this.setPageVisibility(this.page, true);
	}
}
