declare interface LayoutFactory {
    getSize: any;
    keyLookups: ScreenMap;
    addLayout(buttons: string[]): any; //TODO - 'any' should be Layout but the importing breaks the declaration.
    addToBackground(object: PIXI.DisplayObject): PIXI.DisplayObject;
    addToForeground(object: PIXI.DisplayObject): PIXI.DisplayObject;
    removeAll(): void;
    addLookups(keyLookups: ScreenMap): void;
}
