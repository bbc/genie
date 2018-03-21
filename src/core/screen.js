import _merge from "lodash/merge";

export class Screen extends Phaser.State {
    get context() {
        return this._context;
    }

    set context(newContext) {
        this._context = _merge({}, this._context, newContext);
    }

    init(context, next, layoutFactory) {
        this.layoutFactory = layoutFactory;
        this._context = context;
        this._next = next;
    }

    next(changedState) {
        this._next(changedState);
    }
}
