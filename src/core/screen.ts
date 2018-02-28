import * as _ from "lodash";
import "../lib/phaser";

export class Screen extends Phaser.State {
    protected layoutFactory: LayoutFactory;

    private _context: Context;
    private _next: NextScreenFunction;

    public get context(): Context {
        return this._context;
    }

    public set context(newContext) {
        this._context = _.merge({}, this._context, newContext);
    }

    public init(context: Context, next: NextScreenFunction, layoutFactory: LayoutFactory) {
        this.layoutFactory = layoutFactory;
        this._context = context;
        this._next = next;
    }

    public next(changedState?: GameStateUpdate) {
        this._next(changedState);
    }
}
