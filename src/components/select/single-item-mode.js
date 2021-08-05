/**
 * Enforces the correct configuration when one cell per page is set
 *
 * @module components/select/single-item-mode
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const removeEvents = cell => {
	cell.button.off("pointerover", cell.over);
	cell.button.off("pointerout", cell.out);
};

export const create = scene => {
	const continueButton = scene.layout.buttons.continue;
	if (!continueButton) return false;

	const onBlur = () => scene.grid.showPage(0);
	window.addEventListener("blur", onBlur);

	scene._cells.forEach(cell => cell.button.accessibleElement.update());

	const overContinueBtn = () => scene.grid.getPageCells(scene.grid.page)[0].button.sprite.setFrame(1);
	const outContinueBtn = () => scene.grid.getPageCells(scene.grid.page)[0].button.sprite.setFrame(0);

	continueButton.on("pointerover", overContinueBtn);
	continueButton.on("pointerout", outContinueBtn);

	const cellEvents = scene._cells.map(cell => {
		const over = () => continueButton.sprite.setFrame(1);
		const out = () => continueButton.sprite.setFrame(0);

		cell.button.on("pointerover", over);
		cell.button.on("pointerout", out);
		cell.button.config.tabbable = true;
		cell.button.accessibleElement.update();

		return { button: cell.button, over, out };
	});

	const shutdown = () => {
		window.removeEventListener("blur", onBlur);
		continueButton.off("pointerover", overContinueBtn);
		continueButton.off("pointerout", outContinueBtn);
		cellEvents.map(removeEvents);
	};

	scene.events.once(Phaser.Scenes.Events.SHUTDOWN, shutdown);
};

export const isEnabled = scene => scene.config.rows * scene.config.columns === 1;
