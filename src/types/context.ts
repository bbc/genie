declare interface Context {
    gmi: Gmi;
    //inState: GameState; // Todo: make readonly?
    //sequencer: Sequencer;
    layoutFactory: LayoutFactory;
    popupScreens: string[];
    // globalMusic?: Phaser.Sound;
    gameMuted: boolean;
    qaMode: QAMode;
}
