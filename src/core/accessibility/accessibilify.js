/**
 * @module accessibility/accessibilify
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { onScaleChange } from "../scaler.js";
import { accessibleDomElement } from "./accessible-dom-element.js";
import * as a11y from "./accessibility-layer.js";

export function accessibilify(button, config, gameButton = true) {
    config = Object.assign(
        {
            id: button.name,
            ariaLabel: button.name,
        },
        config,
    );

    let signal;
    const game = button.game;
    const screen = game.state.states[game.state.current];
    const elementId = screen.visibleLayer + config.id;
    const accessibleElement = newAccessibleElement();
    const resizeAndRepositionElement = fp.debounce(200, setElementSizeAndPosition);

    if (gameButton) {
        game.accessibleButtons.push(button);
    }

    assignEvents();
    resizeAndRepositionElement();

    button.update = update;
    button.accessibleElement = accessibleElement.el;
    button.elementId = elementId;
    button.elementEvents = accessibleElement.events;

    a11y.addToAccessibleButtons(screen, button);
    a11y.resetElementsInDom(screen);

    return button;

    function newAccessibleElement() {
        return accessibleDomElement({
            id: elementId,
            htmlClass: "gel-button",
            ariaLabel: config.ariaLabel,
            parent: game.canvas.parentElement,
            onClick: buttonAction,
            onMouseOver: mouseOver,
            onMouseOut: mouseOut,
        });
    }

    function getHitAreaBounds() {
        let bounds = button.getBounds();
        if (button.hitArea) {
            bounds = button.hitArea.clone();
            bounds.topLeft = button.toGlobal(bounds.topLeft);
            bounds.scale(button.worldScale.x, button.worldScale.y);
        }
        bounds.topLeft = bounds.topLeft
            .multiply(game.scale.scaleFactorInversed.x, game.scale.scaleFactorInversed.y)
            .add(game.scale.margin.left, game.scale.margin.top);
        bounds.scale(game.scale.scaleFactorInversed.x, game.scale.scaleFactorInversed.y);
        return bounds;
    }

    function setElementSizeAndPosition() {
        if (button.alive) {
            const bounds = getHitAreaBounds();

            accessibleElement.position(bounds);
        }
    }

    function assignEvents() {
        const _destroy = button.destroy;
        button.destroy = () => {
            teardown();
            return _destroy.apply(button, arguments);
        };
        signal = onScaleChange.add(resizeAndRepositionElement);
    }

    function teardown() {
        signal.unsubscribe();
    }

    function update() {
        if (!button.input.enabled) {
            if (accessibleElement.visible()) {
                accessibleElement.hide();
            }
            return;
        }

        if (!accessibleElement.visible()) {
            accessibleElement.show();
        }
    }

    function buttonAction() {
        game.sound.unlock();
        if (game.sound.context && game.sound.context.state === "suspended") {
            game.sound.resumeWebAudio();
        }
        button.events.onInputUp.dispatch(button, game.input.activePointer, false);
    }

    function mouseOver() {
        button.events.onInputOver.dispatch(button, game.input.activePointer, false);
    }

    function mouseOut() {
        button.events.onInputOut.dispatch(button, game.input.activePointer, false);
    }
}
