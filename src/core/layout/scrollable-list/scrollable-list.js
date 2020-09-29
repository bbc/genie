import { accessibilify } from "../../accessibility/accessibilify.js";
import { eventBus } from "../../event-bus.js"

export const scrollableList = (scene, config) => {
    const panelConfig = getConfig(scene, config);
    const panel = scene.rexUI.add.scrollablePanel(panelConfig).layout();
    return panel;
};

export const getConfig = (scene, config) => {
    // take the parameterisable config, i.e. the shop config, that was passed in, and provide the proper config
    const safeArea = scene.layout.getSafeArea();
    return {
        x: 0, 
        y: 0,
        width: safeArea.width,
        height: safeArea.height,
        scrollMode: 0,
        background: scene.add.image(0, 0, config.backgroundImage),
        panel: {
            child: createPanel(scene, config),
            mask: {
                padding: 1,
            },
        },
        slider: {
            track: scene.add.image(0, 0, config.scrollBarTrack),
            thumb: scene.add.image(0, 0, config.scrollBarHandle),
        },
        space: {
            left: config.space,
            right: config.space,
            top: config.space,
            bottom: config.space,
            panel: config.space
        }
    }
};

export const createPanel = (scene, config) => {
    // make the panel
    return scene.add.image(0, 0, "home.title");
};

export const createItem = (scene, config) => {
    // make the items
};
