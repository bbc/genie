/**
 * Startup extends `Phaser.State` and creates a new `Phaser.Game`, as well as a new `Sequencer`.
 * It also instantiates the `Context` object.
 *
 * @module core/startup
 */
import * as _ from "../lib/lodash/lodash.js";

import * as Sequencer from "../core/sequencer.js";
import { parseUrlParams } from "../lib/parseUrlParams.js";

/**
 * @param  {Array} transitions - The transitions JSON object given in main.js.
 * @param  {Object=} initialAdditionalState - Additional state that is added to the inState context.
 * @return {Promise} A Promise, which is resolved with the game in onStarted.
 */
export function startup(transitions, initialAdditionalState) {
    const gmi = window.getGMI({});
    const urlParams = parseUrlParams(window.location.search);
    const qaMode = { active: urlParams.qaMode ? urlParams.qaMode : false, testHarnessLayoutDisplayed: false };
    hookErrors(gmi.gameContainerId);

    const phaserConfig = {
        width: 1400,
        height: 600,
        renderer: Phaser.AUTO,
        antialias: true,
        multiTexture: false,
        parent: getContainerDiv(gmi),
        state: new Startup(gmi, onStarted),
        transparent: true, // Fixes silk browser flickering
    };
    // Keep the console tidy:
    window.PhaserGlobal = window.PhaserGlobal || {};
    window.PhaserGlobal.hideBanner = true;

    const game = new Phaser.Game(phaserConfig);

    let resolvedPromise;

    return new Promise(resolve => {
        resolvedPromise = resolve;
    });

    function onStarted(config) {
        // Phaser is now set up and we can use all game properties.
        game.canvas.setAttribute("aria-hidden", "true");
        const context = {
            gmi,
            inState: _.merge({ transient: {}, persistent: {} }, initialAdditionalState),
            config: config,
            popupScreens: [],
            gameMuted: true,
            qaMode,
            sequencer: { getTransitions: () => [] },
        };
        context.sequencer = Sequencer.create(game, context, transitions);
        game.stage.backgroundColor = "#333";
        resolvedPromise(game);
    }
}

const CONFIG_KEY = "config";

class Startup extends Phaser.State {
    constructor(gmi, onStarted) {
        super();
        this._gmi = gmi;
        this._onStarted = onStarted;
    }

    preload() {
        const gmi = this._gmi;
        this.game.load.baseURL = this._gmi.gameDir;

        // All asset paths are relative to the location of the config.json:
        const theme = gmi.embedVars.configPath;
        const configDir = theme.split(/([^/]+$)/, 2)[0];
        this.game.load.path = configDir;
        this.game.load.json(CONFIG_KEY, "config.json");
    }

    create() {
        this._onStarted(this.game.cache.getJSON(CONFIG_KEY));
    }
}

function hookErrors(gameDivId) {
    const containerDiv = document.getElementById(gameDivId) || document.body;
    let messageElement;

    window.addEventListener("error", event => {
        if (!messageElement) {
            messageElement = containerDiv.appendChild(document.createElement("pre"));
            const padding = "2em";
            const style = messageElement.style;
            style.position = "absolute";
            style.top = style.left = "0";
            style.backgroundColor = "black";
            style.color = "white";
            style.padding = padding;
            style.width = style.height = `calc(100% - 2 * ${padding})`;
        }
        messageElement.innerText = `Something isn't working:\n\n${event.error.message || event.error}\n\n${event.error
            .stack || ""}`;
    });
}

function getContainerDiv(gmi) {
    const containerDiv = document.getElementById(gmi.gameContainerId);
    if (!containerDiv) {
        throw Error(`Container element "#${gmi.gameContainerId}" not found`);
    } else {
        return containerDiv;
    }
}
