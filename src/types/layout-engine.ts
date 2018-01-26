declare interface LayoutEngine {
    keyLookup: StringMap;
    create(screen: Screen, buttons: string[], sfx: Phaser.AudioSprite, soundButton?: boolean): any; //TODO - end should be Layout but this breaks the declaration.
    addToBackground(object: PIXI.DisplayObject): PIXI.DisplayObject;
    removeAll(): void;
    addLookup(keyLookup: StringMap): void;
}