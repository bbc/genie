// @ts-ignore
import * as fp from "lodash/fp";
import { accessibilify } from "../../lib/accessibilify/accessibilify";
import { GelButton } from "./gel-button";

const createButton = fp.curry((game: Phaser.Game, x: number, y: number, isMobile: boolean, key: string) => {
    const btn = new GelButton(game, 0, 0, isMobile, key); //Instantiate then return or TSC loses non-curried args
    return accessibilify(btn, "Test Accessible Button");
});

export const create = (game: Phaser.Game) => ({ createButton: createButton(game, 0, 0) });
