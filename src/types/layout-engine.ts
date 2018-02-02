declare interface LayoutEngine {
    keyLookup: StringMap;
    create(buttons: string[]): any; //TODO - end should be Layout but the below import breaks the declaration.
    addToBackground(object: PIXI.DisplayObject): PIXI.DisplayObject;
    removeAll(): void;
    addLookup(keyLookup: StringMap): void;
    getSize: any;
}
