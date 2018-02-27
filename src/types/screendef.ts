declare type NextScreenFunction = (state?: GameStateUpdate) => any;

declare interface ScreenDef {
    name: string;
    state: any;
    nextScreenName: NextScreenFunction;
}
