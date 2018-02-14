declare interface Context {
    gmi: Gmi;
    //accessibilityManager: AccessibilityManager;
    //inState: GameState; // Todo: make readonly?
    sequencer: any;
    popupScreens: string[];
    // globalMusic?: Phaser.Sound;
    gameMuted: boolean;
    qaMode: QAMode;
}
