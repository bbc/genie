// @ts-ignore
import * as _ from "lodash/fp";
import "phaser-ce";

import { Layout } from "./layout";
import { Screen } from "../screen";
import * as AccessibilityManager from "../stubs/accessibility-manager";
import * as Scaler from "../scaler";

type PhaserElement = Phaser.Sprite | Phaser.Image | Phaser.BitmapText | Phaser.Group;

export function LayoutEngine(game: Phaser.Game): LayoutEngine {
    const root = game.add.group(undefined, "gelGroup", true);
    const background = game.add.group(undefined, "gelBackground");
    const keyLookup: StringMap = {};

    const gmi: Gmi = (window as any).getGMI({});

    //TODO stageHeight should come from config
    const scaler = Scaler.create(600, game);
    const accessibilityManager = AccessibilityManager.create(game, gmi);

    root.addChild(background);

    scaler.onScaleChange.add(scaleBackground);

    return {
        keyLookup,
        addToBackground,
        create,
        removeAll,
        addLookup,
        getSize: scaler.getSize,
    };

    /**
     * Create a new GEL layout manager for a given Genie {@link Screen}
     * Called in the create method of a given screen
     *
     * @example
     * layout.createLayout(["home", "restart", "continue", "pause"]);
     *
     * @param buttons - array of standard button names to include. See {@link ./gel-defaults.ts} for available names
     * @returns {Layout}
     */
    function create(buttons: string[]): Layout {
        const layout = new Layout(game, scaler, accessibilityManager, keyLookup, buttons);

        addToBackground(layout.root);

        return layout;
    }

    //TODO these types seem wrong - 'object' shouldn't need casting
    function addToBackground(object: PhaserElement): PIXI.DisplayObject {
        if ((object as any).anchor) {
            (object as any).anchor.setTo(0.5, 0.5);
        }
        return background.addChild(object);
    }

    function scaleBackground(width: number, height: number, scale: number) {
        background.scale.set(scale, scale);
        background.position.set(width / 2, height / 2);
    }

    function removeAll() {
        background.removeAll();
        // buttons.removeAll();
    }

    function addLookup(moreLookup: StringMap) {
        _.assign(keyLookup, moreLookup);
    }
}
