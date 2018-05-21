/**
 * Stores the asset keys to the phaser game cache in a traversable object.
 *
 * NOTE: The same object path as a string is used as the key in assetLoader so this lookup is provided as a shorthand.
 *       It can be ignored and the asset paths can be used directly
 *
 *       TODO - examples of both. and why you might use either.
 *       TODO - better explanation of how the code all mises together.
 *       TODO - Since the asset path maps to a string could this actually just be a function?
 *       TODO - Investigate parsing here?
 *
 * @example
 * //Method 1 - Use the asset path directly ("home.background"):
 * this.game.add.image(0, 0, "home.background")
 *
 * @example
 * //Method 2 - Use the asset module object lookup (assets.home.background):
 * import { assets } from "assets.js";
 *
 * this.game.add.image(0, 0, assets.home.background)
 *
 * @example
 * //Method 3 - (Inside a Screen module) Use the namespaced 'assets' property of the current screen (this.assets.background)
 *
 * this.game.add.image(0, 0, this.assets.background)
 *
 * @module core/assets
 */
export let assets = {};

export const set = newAssets => (assets = newAssets);

export const getScreenAssets = screen => assets[screen.game.state.current];
