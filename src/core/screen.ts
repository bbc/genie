import "../lib/phaser";

export class Screen extends Phaser.State {
    protected layoutFactory: LayoutFactory;

    private _context: Context;
    private _next: NextScreenFunction;

    get context(): Context {
        return this._context;
    }

    public init(context: Context, next: NextScreenFunction, layoutFactory: LayoutFactory) {
        this.layoutFactory = layoutFactory;
        this._context = context; //TODO make protected?
        this._next = next;
    }

    public next(changedState?: GameStateUpdate) {
        this._next(changedState);
    }
}
