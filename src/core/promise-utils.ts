export class PromiseTrigger<T> implements Promise<T> {
    public [Symbol.toStringTag]: "Promise";
    public resolve: (value?: T | PromiseLike<T> | undefined) => void = () => {};
    public reject: (reason?: any) => void = () => {};
    private promise: Promise<T>;

    constructor() {
        const wrapper = this;
        this.promise = new Promise((resolve, reject) => {
            wrapper.resolve = resolve;
            wrapper.reject = reject;
        });
    }

    public then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined,
    ): Promise<TResult1 | TResult2> {
        return this.promise.then(onfulfilled, onrejected);
    }

    public catch<TResult = never>(
        onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined,
    ): Promise<T | TResult> {
        return this.promise.catch(onrejected);
    }
}
