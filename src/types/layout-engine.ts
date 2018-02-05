declare interface LayoutEngine {
    keyLookups: ScreenMap;
    create(buttons: string[], keyLookup: { [s: string]: string }): any; //TODO - end should be Layout but the below import breaks the declaration.
    addToBackground(object: PIXI.DisplayObject): PIXI.DisplayObject;
    removeAll(): void;
    addLookup(keyLookup: ScreenMap): void;
}

//import { Layout } from "../core/layout/layout";
