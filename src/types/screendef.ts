declare type NextScreenFunction = (state: any) => any;

declare interface ScreenDef {
    name: string;
    state: any;
    nextScreenName: NextScreenFunction;
}
