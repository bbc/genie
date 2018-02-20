declare interface Context {
    gmi: Gmi;
    //inState: GameState; // Todo: make readonly?
    sequencer: any;
    popupScreens: string[];
    // globalMusic?: Phaser.Sound;
    gameMuted: boolean;
    qaMode: QAMode;
}
