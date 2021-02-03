import { createBackground, resizeBackground, getType } from "../../core/layout/scrollable-list/scrollable-list.js";


export const createPaneBackground = (scene, config) => createBackground[getType(config)](scene, config);

