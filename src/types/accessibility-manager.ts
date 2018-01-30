declare interface AccessibilityManager {
    createButton(
        title: string,
        ariaLabel: string,
        anchorPoints: AnchorPoints,
        tabIndex: number,
        cullAccessible: boolean,
        x: number,
        y: number,
        key: string,
        callback?: Function,
        callbackContext?: Phaser.State,
    ): any;
    teardown(): void;
    update(): void;
}

//TODO including below breaks the declaration but the class signature is required by the interface. How should this work?
//import { AccessibleButton } from "../core/stubs/accessible-button";
