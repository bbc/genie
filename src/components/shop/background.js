/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createBackground, getType } from "../../components/shop/scrollable-list/scrollable-list.js";

export const createPaneBackground = (scene, config) => createBackground[getType(config)](scene, config);
