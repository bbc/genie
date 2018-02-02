import "../lib/phaser";

import * as GelLayers from "src/core/gelLayers";
import { PromiseTrigger } from "src/core/promise-utils";
import "../lib/phaser";
import * as Scaler from "src/core/scaler";
import { testHarnessDisplay, QAMode } from "src/components/test-harness/layout";
import { parseUrlParams } from "src/lib/parseUrlParams";
import * as Sequencer from "src/core/sequencer";

export interface Config {
    stageHeightPx: number;
    backgroundColor?: string;
    theme: any;
}

export interface Context {
    gmi: Gmi;
    scaler: Scaler.Scaler;
    gelLayers: GelLayers.GelLayers;
    qaMode: QAMode;
}

export function startup(transitions: Sequencer.ScreenDef[]): Promise<Phaser.Game> {
    const gmi: Gmi = (window as any).getGMI({});
    const urlParams = parseUrlParams(window.location.search);
    const qaMode: QAMode = {
        active: urlParams.qaMode ? urlParams.qaMode : false,
        testHarnessLayoutDisplayed: false,
    };
    hookErrors(gmi.gameContainerId);

    const phaserConfig: Phaser.IGameConfig = {
        width: 800,
        height: 600,
        renderer: Phaser.AUTO,
        antialias: true,
        multiTexture: false,
        parent: getContainerDiv(gmi),
        state: new Startup(gmi, onStarted),
    };
    // Keep the console tidy:
    (window as any).PhaserGlobal = { hideBanner: true };

    const game = new Phaser.Game(phaserConfig);
    const promisedGame = new PromiseTrigger<Phaser.Game>();
    return promisedGame;

    function onStarted(config: Config) {
        // Phaser is now set up and we can use all game properties.
        const scaler = Scaler.create(600, game);
        const gelLayers = GelLayers.create(game, scaler);
        const context: Context = {
            gmi,
            scaler,
            gelLayers,
            qaMode,
        };
        const sequencer = Sequencer.create(game, context, transitions);

        game.stage.backgroundColor = "#00f";

        promisedGame.resolve(game);
        testHarnessDisplay(game, context, scaler).create();
    }
}

const CONFIG_KEY = "config";

class Startup extends Phaser.State {
    constructor(private gmi: Gmi, private onStarted: (config: Config) => void) {
        super();
    }

    public preload() {
        const gmi = this.gmi;
        this.game.load.baseURL = this.gmi.gameDir;

        // All asset paths are relative to the location of the config.json:
        const theme = gmi.embedVars.configPath;
        const [configDir, configFile] = theme.split(/([^/]+$)/, 2);
        this.game.load.path = configDir;

        //this.load.json(CONFIG_KEY, configFile); xxx
    }

    public create() {
        this.onStarted(this.game.cache.getJSON(CONFIG_KEY));
    }
}

function hookErrors(gameDivId: string) {
    const containerDiv = document.getElementById(gameDivId) || document.body;
    let messageElement: HTMLElement;

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

function getContainerDiv(gmi: Gmi): HTMLElement {
    const containerDiv = document.getElementById(gmi.gameContainerId);
    if (!containerDiv) {
        throw Error(`Container element "#${gmi.gameContainerId}" not found`);
    } else {
        return containerDiv;
    }
}
