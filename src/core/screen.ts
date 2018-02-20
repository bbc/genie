import { GameStateUpdate, NextScreenFunction } from "../core/sequencer";

export class Screen extends Phaser.State {
    private _context: Context;
    private next: NextScreenFunction;

    get context(): Context {
        return this._context;
    }

    public init(context: Context, next: NextScreenFunction) {
        this._context = context;
        this.next = next;
    }

    public update() {}

    public exit(changedState: GameStateUpdate) {
        this.next(changedState);
    }

    // public shutdown() {
    //     this.cleanUp();
    // }

    // private cleanUp() {}
}
