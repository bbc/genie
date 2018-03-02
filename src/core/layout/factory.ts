// @ts-ignore
import * as _ from "lodash/fp";

import * as Scaler from "../scaler";
import { Layout } from "./layout";

type PhaserElement = Phaser.Sprite | Phaser.Image | Phaser.BitmapText | Phaser.Group;

export function create(game: Phaser.Game, gameWrapper: HTMLElement): LayoutFactory {
    const root = game.add.group(undefined, "gelGroup", true);
    const background = game.add.group(undefined, "gelBackground");
    const foreground = game.add.group(undefined, "foreground");
    const keyLookups: ScreenMap = {};

    //TODO stageHeight should come from config
    const scaler = Scaler.create(600, game);

    root.addChild(background);
    root.addChild(foreground);

    scaler.onScaleChange.add(scaleBackground);

    return {
        keyLookups,
        addToBackground,
        addToForeground,
        addLayout,
        removeAll,
        addLookups,
        getSize: scaler.getSize,
    };

    /**
     * Create a new GEL layout manager for a given Genie {@link Screen}
     * Called in the create method of a given screen
     *
     * @example
     * layoutFactory.create(["home", "restart", "continue", "pause"]);
     *
     * @param buttons - array of standard button names to include. See {@link ./gel-defaults.ts} for available names
     * @returns {Layout}
     */
    function addLayout(buttons: string[]): Layout {
        const layout = new Layout(game, scaler, buttons);

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

    function addToForeground(object: PhaserElement): PIXI.DisplayObject {
        return foreground.addChild(object);
    }

    function scaleBackground(width: number, height: number, scale: number) {
        background.scale.set(scale, scale);
        background.position.set(width / 2, height / 2);
    }

    function removeAll() {
        background.removeAll(true);
        // buttons.removeAll();
    }

    function addLookups(moreLookups: ScreenMap) {
        Object.assign(keyLookups, moreLookups);
    }
}
