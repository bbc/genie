// @ts-ignore
import * as _ from "lodash/fp";
import "phaser-ce";

import Layout from "./layout";
import { Screen } from "../stubs/screen";
import * as AccessibilityManager from "../stubs/accessibility-manager";
import * as Scaler from "../stubs/scaler";

export function LayoutEngine(game: Phaser.Game): LayoutEngine {
    const root = game.add.group(undefined, "gelGroup", true);
    const background = game.add.group(undefined, "gelBackground");
    const keyLookup: StringMap = {};

    (window as any).bg= background;

    const gmi: Gmi = (window as any).getGMI({});

    //TODO stageHeight should come from config
    const scaler = Scaler.create(600, game);
    const accessibilityManager = AccessibilityManager.create(game, gmi);

    root.addChild(background);

    scaler.onScaleChange.add(scaleBackground);

    return {
        addToBackground,
        create,
        removeAll,
        addLookup,
        keyLookup,
    };


    //TODO merge below from layout?

    /**
     * Create a new GEL layout manager for a given Genie {@link Screen}
     * Called in the create method of a given screen
     *
     * @example
     * this.layout = this.context.gel.createLayout(this, ["home", "restart", "continue", "pause"], sfx);
     *
     * @param screen - The Genie Screen that will be managed by this instance
     * @param buttons - array of standard button names to include. See {@link ./config.ts} for available names
     * @param sfx - Map of all the audio sprites
     * @param soundButton - enable or disable the audio buttons @todo could be parts of the buttons array
     */

    //TODO screen is marked as any until we get screens in, should be> screen: Screen
    //TODO sfx is marked as any until we get sfx in, should be> Phaser.AudioSprite
    function create(screen: any, buttons: string[], sfx: any, soundButton?: boolean): Layout {
        return new Layout(
            game,
            screen,
            scaler,
            addToBackground,
            accessibilityManager,
            keyLookup,
            buttons,
            sfx,
            soundButton,
        );
    }

    function addToBackground(object: PIXI.DisplayObject): PIXI.DisplayObject {
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
