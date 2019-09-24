import { Screen } from "../../core/screen.js";
import { gmi } from "../../core/gmi/gmi.js";
import { settings, settingsChannel } from "../../core/settings.js";
import * as signal from "../../core/signal-bus.js";
import fp from "../../../lib/lodash/fp/fp.js";
import * as LayoutManager from "../../core/layout-manager.js";
import { loadFonts } from "./font-loader.js";
import * as a11y from "../../core/accessibility/accessibility-layer.js";

const triggeredByGame = arg => arg instanceof Phaser.Game;
const setImage = button => button.setImage(settings.getAllSettings().audio ? "audio-on" : "audio-off");
const getButtons = fp.map(fp.get("buttons.audio"));
const filterUndefined = fp.filter(x => !!x);

export class Boot extends Screen {
    #onStarted;

    constructor(onStarted) {
        super({ key: "boot" });
        this.#onStarted = onStarted;
    }

    preload() {
        this.load.baseURL = gmi.gameDir;
        this.load.path = gmi.embedVars.configPath; //config dir
        this.load.json("config", "config.json");
        //TODO P3 this is loaded now so we can check its keys for missing files. It is also loaded again later so perhaps could be done then? NT
        this.load.json("asset-master-pack", "asset-master-pack.json");

        //TODO P3 - if the above could be changed this could potentially be part of loadscreen.js and we could delete boot

        //TODO P3 enable below once signal bus is ready
        //signal.bus.subscribe({
        //    channel: settingsChannel,
        //    name: "settings-closed",
        //    callback: () => {
        //        this.game.canvas.focus();
        //    },
        //});
        //this.configureAudioSetting();
    }

    configureAudioSetting() {
        this.game.sound.mute = !settings.getAllSettings().audio;
        this.game.onPause.add(arg => {
            //Re enable sound if triggered by the game (from the pause menu)
            //otherwise this will be a window focus event and should be muted
            this.game.sound.mute = triggeredByGame(arg) ? !settings.getAllSettings().audio : true;
        });

        this.game.onResume.add(() => {
            this.game.sound.mute = !settings.getAllSettings().audio;
        });

        signal.bus.subscribe({
            channel: settingsChannel,
            name: "audio",
            callback: value => {
                this.game.sound.mute = !value;
                const state = this.game.state;
                const layouts = state.states[state.current].layoutManager.getLayouts();

                fp.map(setImage, filterUndefined(getButtons(layouts)));
            },
        });
    }

    create() {

        //TODO P3 these could be set using this.game on loadscreen?
        // Phaser is now set up and we can use all game properties.
        this.game.canvas.setAttribute("tabindex", "-1");
        this.game.canvas.setAttribute("aria-hidden", "true");

        //TODO P3 where should this now live? [NT]
        //TODO P3 mainly just initialises scaler now?
        const layoutManager = LayoutManager.create(this.game);

        //TODO P3 now part of camera and set per scene e.g: this.cameras.main.backgroundColor.setTo(255,255,255);
        //this.game.stage.backgroundColor = "#333";

        loadFonts(this.game, this.bootComplete);

        a11y.setup(this.game.canvas.parentElement);
    }

    bootComplete = () => {
        this.switchScene("loadscreen");
    }
}
