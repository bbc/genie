import fp from "../../lib/lodash/fp/fp.js";
import { accessibilify } from "../../lib/accessibilify/accessibilify.js";
import { GelButton } from "./gel-button.js";

const createButton = fp.curry((game, x, y, isMobile, key) => {
    const btn = new GelButton(game, 0, 0, isMobile, key); //Instantiate then return or TSC loses non-curried args
    return accessibilify(btn, "Test Accessible Button");
});

export const create = game => ({ createButton: createButton(game, 0, 0) });
