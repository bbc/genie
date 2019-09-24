/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import _ from "../../lib/lodash/lodash.js";

import { gmi } from "../core/gmi/gmi.js";
import * as signal from "../core/signal-bus.js";
import * as GameSound from "../core/game-sound.js";
import * as a11y from "../core/accessibility/accessibility-layer.js";
import * as VisibleLayer from "../core/visible-layer.js";
import fp from "../../lib/lodash/fp/fp.js";
import * as Scaler from "./scaler.js";
import * as Layout from "./layout/layout.js";

/**
 * The `Screen` class extends `Phaser.State`, providing the `Context` to objects that extend from it.
 * All the game screens will extend from this class.
 */
export class Screen extends Phaser.Scene {
    #context;
    #transientData = {};
    #layouts = [];

    get context() {
        return this.#context;
    }

    set context(newContext) {
        this.#context = _.merge({}, this.#context, newContext);
    }

    getAsset(name) {
        return this.game.state.current + "." + name;
    }

    //TODO P3 only one argument is now passed to init
    //init(transientData, layoutManager, context, navigation) {
    init(config) {
        this.layoutManager = config.layoutManager;
        this.#context = config.context;

        //TODO P3 remove debug line - currently useful to know which screen has been started NT
        console.log(`SCREEN INIT ${this.scene.key}:`, config);

        //TODO P3 This centers the camera - we don't necessarily have to do this anymore. Most people are used to top left being origin NT
        this.cameras.main.scrollX = -700;
        this.cameras.main.scrollY = -300;

        //TODO P3 commented out lines need re-enabling
        //this.navigation = config.navigation[this.scene.key].routes;
        //const themeScreenConfig = this.context.config.theme[this.game.state.current];
        //if (this.game.state.current !== "loadscreen") {
        //    gmi.setStatsScreen(this.game.state.current);
        //}
        //GameSound.setupScreenMusic(this.game, themeScreenConfig);
        this.#transientData = config.transientData;
        a11y.clearAccessibleButtons();
        //a11y.clearElementsFromDom();
        //this.overlaySetup();

        //TODO P3 these might not be needed anymore NT
        //const routes = navigation[this.game.state.current].routes;
        //this.navigation = fp.mapValues(value => () => value(this.transientData || {}), routes);
    }

    overlaySetup() {
        signal.bus.subscribe({
            channel: "overlays",
            name: "overlay-closed",
            callback: this.onOverlayClosed.bind(this),
        });
    }

    onOverlayClosed(data) {
        a11y.clearElementsFromDom();
        a11y.clearAccessibleButtons(this);
        this.context.popupScreens.pop();
        a11y.appendElementsToDom(this);
        if (data.firePageStat) {
            gmi.setStatsScreen(this.game.state.current);
        }
        signal.bus.removeChannel("overlays");
        this.overlaySetup();
    }

    switchScene(nextScene) {
        console.log("switchScene", nextScene);

        //TODO P3 [NT]
        // navigation does this - start(name, {transientData, scene, context, navigation});
        // hopefully attaching to screen means we can dump scene as it's always 'this'
        // can we also remove navigation if done here?
        // we also need the navigation map passing somehow so next works.
        // nav needs to change to just be a text map


        //this is starting to get better but we need the nav routing
        //also this data thing looks hacky. Why can we set it on this

        const data = {
            transientData: this.#transientData,
            context: this.#context,
        }

        this.scene.start(nextScene, data);
    }

    /**
     * Create a new GEL layout for a given set of Gel Buttons
     * Called in the create method of a given screen
     *
     * @example
     * this.addLayout(["home", "restart", "continue", "pause"]);
     * @param {Array} buttons - Array of standard button names to include. See {@link layout/gel-defaults.js} for available names
     *
     * @memberof module:screen
     * @returns {Object}
     */
    addLayout(buttons) {
        //TODO P3 passing in the root here . Maybe it can be moved?
        const layoutRoot = this.add.container(0, 0);

        //P3 TODO passing in "this" smells
        const layout = Layout.create(this, Scaler.getMetrics(), buttons, layoutRoot);
        //TODO P3 I don't think this is needed anymore as they are added to the scene: addToGroup(background, layout.root);
        this.#layouts.push(layout);

        return layout;
    }

    get visibleLayer() {
        return VisibleLayer.get(this.game, this.context);
    }
}
