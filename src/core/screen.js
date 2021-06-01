/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";

import { gmi } from "./gmi/gmi.js";
import { buttonsChannel } from "./layout/gel-defaults.js";
import { eventBus } from "./event-bus.js";
import { setMusic } from "./music.js";
import * as a11y from "../core/accessibility/accessibility-layer.js";
import * as Scaler from "./scaler.js";
import * as Layout from "./layout/layout.js";
import { settingsChannel } from "./settings.js";
import { furnish } from "./background/items.js";
import { isDebug } from "./debug/debug-mode.js";
import * as debug from "./debug/debug.js";
import { CAMERA_X, CAMERA_Y } from "./layout/metrics.js";
import { nextPage } from "./background/pages.js";
import { createTitles } from "./titles.js";
import { gel } from "./layout/gel.js";

const getRoutingFn = scene => route => {
    const routeTypes = {
        function: () => route(scene),
        string: () => scene.navigate(route),
    };

    return routeTypes[typeof route];
};

let activeScreens = [];

/**
 * The `Screen` class extends `Phaser.State`, providing the `Context` to objects that extend from it.
 * All the game screens will extend from this class.
 */
export class Screen extends Phaser.Scene {
    constructor(sceneConfig) {
        super(sceneConfig);
    }

    get context() {
        return {
            config: this._data.config,
            activeScreens,
            navigation: this._data.navigation,
            transientData: this._data.transient || {},
        };
    }

    get layout() {
        return this._layout;
    }

    //TODO P3 the only context parts we want them to set is transient data
    //TODO P3 maybe it should be separate? [NT]
    set transientData(newData) {
        this._data.transient = fp.merge(this._data.transient, newData, {});
    }

    get config() {
        return this._data.config[this.scene.key];
    }

    get transientData() {
        return this._data.transient;
    }

    get assetPrefix() {
        return this.config.assetPrefix || this.scene.key;
    }

    init(data) {
        this._data = data;
        activeScreens.push({ screen: this, addedBy: data.addedBy });
        this.cameras.main.scrollX = -CAMERA_X;
        this.cameras.main.scrollY = -CAMERA_Y;
        this.pageIdx = -1;
        this.timedItems = [];
        data.config && this.events.once("create", nextPage(this));

        if (this.scene.key !== "loader" && this.scene.key !== "boot") {
            if (!this.scene.key.includes("shop")) {
                gmi.setStatsScreen(this.scene.key);
            }
            setMusic(this);

            isDebug() && debug.addEvents(this);
            this.events.once(Phaser.Scenes.Events.CREATE, () => (this.titles = createTitles(this)));
        }

        this.sys.accessibleButtons = [];
        this.sys.accessibleGroups = [];
        a11y.destroy();

        this._makeNavigation();
        gel?.start();
    }

    setData(newData) {
        this._data = newData;
    }

    setConfig(newConfig) {
        this._data.config = newConfig;
    }

    _makeNavigation = () => {
        const routes = this.scene.key === "boot" ? { next: "loader" } : this._data.navigation[this.scene.key].routes;
        this.navigation = fp.mapValues(getRoutingFn(this), routes);
    };

    addBackgroundItems = furnish(this);

    addOverlay(key) {
        this.scene.run(key, { ...this._data, addedBy: this });
        this.scene.bringToTop(key);
        gel?.hide();
    }

    removeOverlay = () => {
        activeScreens = activeScreens.filter(active => active.screen !== this);
        this._data.addedBy._onOverlayRemoved(this);
    };

    _onOverlayRemoved = overlay => {
        a11y.destroy();
        overlay.removeAll();
        overlay.scene.stop();
        this._layout.makeAccessible();
        this.sys.accessibleButtons.forEach(button => a11y.addButton(button));
        a11y.reset();
        if (this.scene.key.includes("shop")) {
            gmi.setStatsScreen(this.transientData.shopTitle + "menu");
        } else {
            gmi.setStatsScreen(this.scene.key);
        }

        eventBus.publish({
            channel: settingsChannel,
            name: "audio",
            data: gmi.getAllSettings().audio,
        });
    };

    removeAll = () => {
        eventBus.removeChannel(buttonsChannel(this));
        this._layout && this._layout.destroy();
        delete this._layout;
        gel?.clear();
    };

    navigate = route => {
        this.scene.bringToTop(route);
        activeScreens.forEach(active => {
            active.screen.removeAll();
            active.screen.scene.stop();
        });
        activeScreens = [];
        delete this._data.addedBy;
        this.scene.start(route, this._data);
    };

    setLayout(buttons, accessibleButtons) {
        this._layout = Layout.create(this, Scaler.getMetrics(), buttons, accessibleButtons);
        this.add.existing(this._layout.root);

        return this._layout;
    }
}
