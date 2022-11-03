/**
 * Pre-booter for assets needed by loadscreen and general early game setup
 *
 * @module components/loadscreen
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import { gmi } from "../gmi/gmi.js";
import { settings, settingsChannel } from "../../core/settings.js";
import { eventBus } from "../../core/event-bus.js";
import fp from "../../../lib/lodash/fp/fp.js";
import * as Scaler from "../scaler.js";
import { getTheme } from "../get-theme.js";

//const triggeredByGame = arg => arg instanceof Phaser.Game;
const setImage = button => button.setImage(settings.getAllSettings().audio ? "audio-on" : "audio-off");
const getAudioButtons = fp.map(fp.get("layout.buttons.audio"));


const getDefaultStartScreen = config => {
	return Object.keys(config)[Object.values(config).findIndex(screen => screen.default === true)] || "home";
};

export class Boot extends Screen {
	constructor(navigationConfig) {
		super({ key: "boot" });
		this._navigationConfig = navigationConfig;

		this._navigationConfig.boot = { routes: { next: "loader" } };
		const defaultStartScreen = getDefaultStartScreen(navigationConfig);
		this._navigationConfig.loader = { routes: { next: defaultStartScreen } };
	}

	preload() {
		this.load.setBaseURL(gmi.gameDir);
		this.load.setPath(getTheme());
		this.load.setCORS("anonymous");

		//TODO P3 this is loaded now so we can check its keys for missing files. It is also loaded again later so perhaps could be done then? NT
		this.load.json("asset-master-pack", "asset-master-pack.json");
		this.load.json("font-pack", "fonts.json");

		this.setData({
			parentScreens: [],
			transient: {},
			navigation: this._navigationConfig,
		});
		//TODO P3 - if the above could be changed this could potentially be part of loadscreen.js and we could delete boot

		eventBus.subscribe({
			channel: settingsChannel,
			name: "settings-closed",
			callback: () => {
				this.game.canvas.focus();
			},
		});

		this.configureAudioSetting();
	}

	configureAudioSetting() {
		eventBus.subscribe({
			channel: settingsChannel,
			name: "audio",
			callback: () => {
				const audioEnabled = settings.getAllSettings().audio;
				this.sound.mute = !audioEnabled;
				const activeScenes = this.scene.manager.getScenes(false);

				fp.map(setImage, getAudioButtons(activeScenes).filter(Boolean));
			},
		});
	}

	create() {
		//TODO P3 these could be set using this.game on loadscreen?
		this.game.canvas.setAttribute("tabindex", "-1");
		this.game.canvas.setAttribute("aria-hidden", "true");

		//TODO P3 where should this now live? [NT]
		//TODO P3 mainly just initialises scaler now?
		Scaler.init(600, this.game);
		this.navigation.next();
	}
}
