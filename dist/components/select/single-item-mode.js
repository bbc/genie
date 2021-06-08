/**
 * Enforces the correct configuration when one cell per page is set
 *
 * @module components/select/single-item-mode
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var removeEvents = function removeEvents(cell) {
  cell.button.off("pointerover", cell.over);
  cell.button.off("pointerout", cell.out);
};

export var create = function create(scene) {
  var continueButton = scene.layout.buttons.continue;
  if (!continueButton) return false;

  var onBlur = function onBlur() {
    return scene.grid.showPage(0);
  };

  window.addEventListener("blur", onBlur);

  scene._cells.forEach(function (cell) {
    return cell.button.accessibleElement.update();
  });

  var overContinueBtn = function overContinueBtn() {
    return scene.grid.getPageCells(scene.grid.page)[0].button.sprite.setFrame(1);
  };

  var outContinueBtn = function outContinueBtn() {
    return scene.grid.getPageCells(scene.grid.page)[0].button.sprite.setFrame(0);
  };

  continueButton.on("pointerover", overContinueBtn);
  continueButton.on("pointerout", outContinueBtn);

  var cellEvents = scene._cells.map(function (cell) {
    var over = function over() {
      return continueButton.sprite.setFrame(1);
    };

    var out = function out() {
      return continueButton.sprite.setFrame(0);
    };

    cell.button.on("pointerover", over);
    cell.button.on("pointerout", out);
    cell.button.config.tabbable = true;
    cell.button.accessibleElement.update();
    return {
      button: cell.button,
      over: over,
      out: out
    };
  });

  var shutdown = function shutdown() {
    window.removeEventListener("blur", onBlur);
    continueButton.off("pointerover", overContinueBtn);
    continueButton.off("pointerout", outContinueBtn);
    cellEvents.map(removeEvents);
  };

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, shutdown);
};
export var isEnabled = function isEnabled(scene) {
  return scene.context.theme.rows * scene.context.theme.columns === 1 ? true : false;
};