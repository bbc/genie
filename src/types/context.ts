declare interface Context {
    gmi: Gmi;
    inState: GameState; // Todo: make readonly?
    sequencer: Sequencer;
    popupScreens: string[];
    // globalMusic?: Phaser.Sound;
    gameMuted: boolean;
    qaMode: QAMode;
}
