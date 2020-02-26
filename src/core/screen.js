/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";

import { gmi } from "../core/gmi/gmi.js";
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { eventBus } from "../core/event-bus.js";
import * as GameSound from "../core/game-sound.js";
import * as a11y from "../core/accessibility/accessibility-layer.js";
import * as Scaler from "./scaler.js";
import * as Layout from "./layout/layout.js";
import { settingsChannel } from "./settings.js";
import { addAnimations } from "./background-animations.js";
import { debugMode } from "./debug/debug-mode.js";
import * as debug from "./debug/debug.js";
import { CAMERA_X, CAMERA_Y } from "./layout/metrics.js";

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
            theme: this._data.config.theme[this.scene.key],
            parentScreens: this._data.parentScreens,
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

    get transientData() {
        return this._data.transient;
    }

    get assetPrefix() {
        return this.context.theme.assetPrefix || this.scene.key;
    }

    init(data) {
        this._data = data;
        this.cameras.main.scrollX = -CAMERA_X;
        this.cameras.main.scrollY = -CAMERA_Y;

        if (this.scene.key !== "loader" && this.scene.key !== "boot") {
            this.themeScreenConfig = this._data.config.theme[this.scene.key];
            this.setStatsScreen(this.scene.key);
            GameSound.setupScreenMusic(this.scene.scene, this.themeScreenConfig);

            debugMode() && debug.addEvents(this);
        }

        this.sys.accessibleButtons = [];
        this.sys.accessibleGroups = [];
        a11y.destroy();

        this._makeNavigation();
    }

    setStatsScreen(screen) {
        if (!this.themeScreenConfig.isOverlay) {
            gmi.setStatsScreen(screen);
        }
    }

    setData(newData) {
        this._data = newData;
    }

    setConfig(newConfig) {
        this._data.config = newConfig;
    }

    _makeNavigation = () => {
        const routes = this.scene.key === "boot" ? { next: "loader" } : this._data.navigation[this.scene.key].routes;
        this.navigation = fp.mapValues(
            route => () => {
                this._navigate(route);
            },
            routes,
        );
    };

    addAnimations = addAnimations(this);

    addOverlay(key) {
        this._data.parentScreens.push(this);
        this.scene.run(key, this._data);
        this.scene.bringToTop(key);
    }

    removeOverlay = () => {
        const parentScreen = this._data.parentScreens.pop();
        parentScreen._onOverlayRemoved(this);
    };

    _onOverlayRemoved = overlay => {
        a11y.destroy();
        overlay.removeAll();
        overlay.scene.stop();
        this._layout.makeAccessible();
        this.sys.accessibleButtons.forEach(button => a11y.addButton(button));
        a11y.reset();
        gmi.setStatsScreen(this.scene.key);

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
    };

    _navigate = route => {
        this.scene.bringToTop(route);
        while (this._data.parentScreens.length > 0) {
            const parentScreen = this._data.parentScreens.pop();
            parentScreen.removeAll();
            parentScreen.scene.stop();
        }
        this.removeAll();
        this.scene.start(route, this._data);
    };

    /**
     * Create a new GEL layout for a given set of Gel Buttons
     * Called in the create method of a given screen
     *
     * @example
     * this.setLayout(["home", "restart", "continue", "pause"]);
     * @param {Array} buttons - Array of standard button names to include. See {@link layout/gel-defaults.js} for available names
     * @param {Array} accessibleButtons - Array of standard button names to make accessible. By default, all are accessible.
     * @memberof module:screen
     * @returns {Object}
     */
    setLayout(buttons, accessibleButtons) {
        this._layout = Layout.create(this, Scaler.getMetrics(), buttons, accessibleButtons);
        this.add.existing(this._layout.root);

        return this._layout;
    }
}
