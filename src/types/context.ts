declare interface Context {
    gmi: Gmi;
    //accessibilityManager: AccessibilityManager;
    //inState: GameState; // Todo: make readonly?
    //sequencer: Sequencer;
    layoutFactory: LayoutFactory;
    popupScreens: string[];
    // globalMusic?: Phaser.Sound;
    gameMuted: boolean;
    qaMode: QAMode;
}
