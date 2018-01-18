import { Loadscreen } from "src/components/loadscreen";
import { drawSomething } from "src/core/drawsomething";
import "../lib/phaser";

export interface Config {
    stageHeightPx: number;
    backgroundColor?: string;
    theme: any;
}

export interface Context {
    gmi: Gmi;
}

export function startup() {
    const gmi: Gmi = (window as any).getGMI({});
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

    const game = new Phaser.Game(phaserConfig);

    function onStarted(config: Config) {
        // Phaser is now set up and we can use all game properties.
        const context: Context = {
            gmi,
        };

        game.stage.backgroundColor = "#00f"; //config.backgroundColor || "#000";
        drawSomething(game);

        game.state.add("Loader", new Loadscreen());
        game.state.start("Loader");
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

        //this.load.json(CONFIG_KEY, configFile);
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
