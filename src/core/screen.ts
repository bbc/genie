import "phaser-ce";

import { Context } from "./startup";
import * as Sequencer from "src/core/sequencer";

export class Screen extends Phaser.State {
    private _context: Context;
    private next: Sequencer.NextScreenFunction;

    get context(): Context {
        return this._context;
    }

    public init(context: Context, next: Sequencer.NextScreenFunction) {
        this._context = context;
        this.next = next;
    }

    public update() {}

    public exit(changedState: Sequencer.GameStateUpdate) {
        this.next(changedState);
    }

    public shutdown() {
        this.cleanUp();
    }

    public cleanUp() {}
}
