// @ts-ignore
import * as fp from "lodash/fp";

import { GelButton } from "./gel-button";

const createButton = fp.curry((game: Phaser.Game, x: number, y: number, isMobile: boolean, key: string) => {
    const btn = new GelButton(game, 0, 0, isMobile, key); //Instantiate then return or TSC loses non-curried args
    return btn;
});

export const create = (game: Phaser.Game) => ({ createButton: createButton(game, 0, 0) });
