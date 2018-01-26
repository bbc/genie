declare type GameState = TransientState & PersistentState;

declare interface TransientState {
    transient: any;
}

declare interface PersistentState {
    persistent: any;
}

declare type GameStateUpdate = GameState | TransientState | PersistentState | {};

declare type NextScreenFunc = (state: any) => string;

declare interface ScreenDef {
    name: string;
    state: Screen;
    nextScreenName: NextScreenFunc;
}

declare interface Sequencer {
    next(outState: GameStateUpdate): void;
    getTransitions(): ScreenDef[];
}

