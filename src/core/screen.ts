import "phaser-ce";

export class Screen extends Phaser.State {
    private _context: Context;
    private next: NextScreenFunction;

    protected layoutFactory: LayoutFactory;

    get context(): Context {
        return this._context;
    }

    public init(context: Context, next: NextScreenFunction, layoutFactory: LayoutFactory) {
        this.layoutFactory = layoutFactory;
        this._context = context; //TODO make protected?
        this.next = next;
    }

    public update() {}

    public exit(changedState: GameStateUpdate) {
        this.next(changedState);
    }
}
