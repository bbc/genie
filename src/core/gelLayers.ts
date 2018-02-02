import * as _ from "lodash";

import { Scaler } from "src/core/scaler";
import { Context } from "src/core/startup";

interface StringMap {
    [s: string]: string;
}

export interface GelLayers {
    keyLookup: StringMap;
    addToBackground(object: Phaser.Image | Phaser.Sprite | Phaser.BitmapText | Phaser.Group): PIXI.DisplayObject;
    addToGel(object: Phaser.Image | Phaser.Sprite | Phaser.BitmapText): PIXI.DisplayObject;
    addLookup(keyLookup: StringMap, context: GelLayers): GelLayers;
}

/**
 * Create gel layers for the foreground and background, with foreground elements scaling at a breakpoint.
 * Adding something to the background layer will cause it to be scaled dynamically according to the size of the screen.
 * Called in the Genie startup function but will be called by the layout manager when it is ready.
 *
 * @example
 * const gelLayers = GelLayers.create(game, scaler);
 *
 * @param game - The phaser game to manage
 * @param scaler - A previously instantiated scaler
 */

export function create(game: Phaser.Game, scaler: Scaler): GelLayers {
    const root = game.add.group(undefined, "gelGroup", true);
    const background = game.add.group(undefined, "gelBackground");
    const foreground = game.add.group(undefined, "gelForeground");
    root.addChild(background);
    root.addChild(foreground);

    scaler.onScaleChange.add(scaleBackground);

    return {
        addToBackground,
        addToGel,
        addLookup,
        keyLookup: {},
    };

    function addToBackground(object: Phaser.Image | Phaser.Sprite | Phaser.BitmapText | Phaser.Group): PIXI.DisplayObject {
        if ((object as any).anchor) {
            (object as any).anchor.setTo(0.5, 0.5);
        }
        return background.addChild(object);
    }

    function addToGel(object: Phaser.Image | Phaser.Sprite | Phaser.BitmapText): PIXI.DisplayObject {
        if ((object as any).anchor) {
            (object as any).anchor.setTo(0.5, 0.5);
        }
        return foreground.addChild(object);
    }

    function scaleBackground(width: number, height: number, scale: number) {
        background.scale.set(scale, scale);
        background.position.set(width / 2, height / 2);
    }

    function addLookup(keyLookup: StringMap, context: GelLayers): GelLayers {
        return {
            addToBackground,
            addToGel,
            addLookup,
            keyLookup: _.assign(context.keyLookup, keyLookup),
        };
    }
}
