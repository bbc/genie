/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { handleClickIfVisible } from "./scrollable-list-handlers.js";
import { eventBus } from "../../event-bus.js";
import { overlays1Wide } from "./button-overlays.js";
import { accessibilify } from "../../accessibility/accessibilify.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const STATES = ["cta", "actioned"];

const createGelButton = (scene, item, title, state, prepTx) => {
    const id = `scroll_button_${item.id}_${title}`;
    const config = scene.config;

    const gelConfig = {
        gameButton: true,
        accessibilityEnabled: true,
        ariaLabel: item.ariaLabel,
        channel: config.eventChannel,
        group: scene.scene.key,
        id,
        key: config.assetKeys.itemBackground,
        scene: scene.assetPrefix,
        scrollable: true,
    };

    const gelButton = scene.add.gelButton(0, 0, gelConfig);

    gelButton.overlays = {
        ...gelButton.overlays,
        configs: {
            items: config.overlay.items,
            options: config.overlay.options[title],
        },
        setAll: setOverlays(gelButton, item),
        unsetAll: unsetOverlays(gelButton),
        state: STATES.find(st => st === state),
        toggleState: toggleState(gelButton),
        toggle: toggle(gelButton),
    };

    const callback = () => prepTx(item, title);

    eventBus.subscribe({
        callback: handleClickIfVisible(gelButton, scene, callback),
        channel: gelConfig.channel,
        name: id,
    });

    scaleButton(gelButton, scene.layout, config.listPadding.x);
    makeAccessible(gelButton);
    gelButton.overlays.setAll();
    return gelButton;
};

const scaleButton = (gelButton, layout, space) => {
    const safeArea = layout.getSafeArea({}, false);
    const scaleFactor = (safeArea.width - space * 4) / gelButton.width;
    gelButton.setScale(scaleFactor);
};

const toggle = button => () => {
    button.overlays.unsetAll();
    button.overlays.toggleState();
    button.overlays.setAll();
};

const toggleState = button => () =>
    fp.cond([
        [btn => btn.overlays.state === "cta", btn => (btn.overlays.state = "actioned")],
        [btn => btn.overlays.state === "actioned", btn => (btn.overlays.state = "cta")],
    ])(button);

const getConfigs = button =>
    button.overlays.configs.items.concat(
        button.overlays.configs.options.filter(overlay => overlay.activeStates.includes(button.overlays.state)),
    );

const setOverlays = (button, item) => () => overlays1Wide({ gelButton: button, item, configs: getConfigs(button) });

const unsetOverlays = button => () => Object.keys(button.overlays.list).forEach(key => button.overlays.remove(key));

const makeAccessible = gelButton => accessibilify(gelButton);

export { createGelButton, scaleButton };
