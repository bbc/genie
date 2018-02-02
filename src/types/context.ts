declare interface Context {
    gmi: Gmi;
    //accessibilityManager: AccessibilityManager;
    //inState: GameState; // Todo: make readonly?
    //sequencer: Sequencer;
    layout: LayoutEngine,
    popupScreens: string[];
   // globalMusic?: Phaser.Sound;
    gameMuted: boolean;
    qaMode: QAMode;
}
