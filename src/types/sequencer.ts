declare type GameState = TransientState & PersistentState;

declare interface TransientState {
    transient: any;
}

declare interface PersistentState {
    persistent: any;
}

declare type GameStateUpdate = GameState | TransientState | PersistentState | {};

declare interface Sequencer {
    getTransitions(): ScreenDef[];
    next(outState: GameStateUpdate): void;
}
