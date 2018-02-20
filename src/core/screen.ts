import "../lib/phaser";

export class Screen extends Phaser.State {
    protected layoutFactory: LayoutFactory;

    private _context: Context;
    private next: NextScreenFunction;

    get context(): Context {
        return this._context;
    }

    public init(context: Context, next: NextScreenFunction, layoutFactory: LayoutFactory) {
        this.layoutFactory = layoutFactory;
        this._context = context; //TODO make protected?
        this.next = next;
    }

    public exit(changedState: GameStateUpdate) {
        this.next(changedState);
    }
}
