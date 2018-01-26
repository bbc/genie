declare interface Context {
    gmi: Gmi;
    accessibilityManager: AccessibilityManager;
    inState: GameState; // Todo: make readonly?
    sequencer: Sequencer;
    //config: Config;
    //scaler: Scaler.Scaler;
    //gel: Gel.Gel;
    popupScreens: string[];
    globalMusic?: Phaser.Sound;
    gameMuted: boolean;
}