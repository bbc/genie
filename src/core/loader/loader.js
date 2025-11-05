/**
 * Loadscreen loads in the game's assets.
 *
 * @module components/loadscreen
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import * as Scaler from "../scaler.js";
import { gmi } from "../gmi/gmi.js";
import { loadPack } from "./loadpack.js";
import { getConfig, loadConfig } from "./get-config.js";
import { isDebug } from "../debug/debug-mode.js";
import { loadCollections } from "./load-collections.js";
import { getTheme } from "../get-theme.js";

const getScreenKeys = keys =>
	Object.keys(keys).filter(key => ["default", "boot", "loader", "debug"].indexOf(key) === -1);

const loaderComplete = scene => () => {
	scene.navigation.next();
	gmi.sendStatsEvent("gameloaded", "true");
	gmi.gameLoaded();
};

export class Loader extends Screen {
	constructor() {
		loadPack.path = gmi.gameDir + getTheme();
		super({ key: "loader", pack: loadPack });
		this._loadbar = undefined;
		this._progress = 0;
	}

	preload() {
		this.load.setBaseURL(gmi.gameDir);
		this.load.setPath(getTheme());
		this.loaderConfig = this.cache.json.get("config");

		const webFontConfig = {
			key: "font-pack",
			config: this.cache.json.get("font-pack"),
		};
		this.load.webfont(webFontConfig);

		const masterPack = this.cache.json.get("asset-master-pack");
		const debugPack = isDebug() ? ["../../debug"] : [];
		this.screenKeys = getScreenKeys(this.scene.manager.keys).concat(debugPack);
		const gamePacksToLoad = ["gel"].concat(this.screenKeys);

		loadConfig(this, this.screenKeys);
		this.load.json5({
			key: "achievements-data",
			url: "achievements/config.json5",
		});

		gamePacksToLoad.forEach(pack => this.load.pack(`${pack}/assets`));
		this.load.addPack(masterPack);

		this.add.image(0, 0, "loader.background");
		this.add.image(0, -120, "loader.title");

		this.createLoadBar();
		this.createBrandLogo();

		this.load.on("progress", this.updateLoadBar.bind(this));
	}

	createLoadBar() {
		this.add.image(0, this.loaderConfig?.loadingBarPosY ?? 130, "loader.loadbarBackground");
		this._loadbar = this.add.image(0, this.loaderConfig?.loadingBarPosY ?? 130, "loader.loadbar");
		this.updateLoadBar(0);
	}

	updateLoadBar = progress => {
		if (progress >= this._progress) {
			this._progress = progress;
			this._loadbar.frame.cutWidth = this._loadbar.width * progress;
			this._loadbar.frame.updateUVs();
		}
		if (window.__debug && window.__debug.debugParam !== "nolog") {
			console.log("Loader progress:", progress); // eslint-disable-line no-console
		}
	};

	createBrandLogo() {
		const metrics = Scaler.getMetrics();
		const x = metrics.horizontals.right - metrics.horizontalBorderPad / metrics.scale;
		const y = metrics.verticals.bottom - metrics.verticalBorderPad / metrics.scale;
		this.brandLogo = this.add.image(x, y, "loader.brandLogo");
		this.brandLogo.setOrigin(1, 1);
	}

	create() {
		const config = getConfig(this, this.screenKeys);
		this.setConfig(config);
		gmi.achievements.init(this.cache.json.get("achievements-data"));
		loadCollections(this, config).then(loaderComplete(this));
	}
}
