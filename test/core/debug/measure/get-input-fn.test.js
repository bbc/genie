/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getInputFn } from "../../../../src/core/debug/measure/get-input-fn.js";

describe("Measure Tool Get input", () => {
    let keys;

    beforeEach(() => {
        keys = {
            ctrl: { isDown: false },
            shift: { isDown: false },
            up: { isDown: false },
            down: { isDown: false },
            left: { isDown: false },
            right: { isDown: false },
        };
    });

    afterEach(jest.clearAllMocks);

    test("Returns zero delta if no keys pressed", () => {
        expect(getInputFn(keys)()).toEqual({ height: 0, width: 0, x: 0, y: 0 });
    });

    test("Returns position delta if cursors pressed", () => {
        keys.up.isDown = true;
        keys.right.isDown = true;

        expect(getInputFn(keys)()).toEqual({ height: 0, width: 0, x: 1, y: -1 });
    });

    test("Returns size delta if ctrl and cursors pressed", () => {
        keys.ctrl.isDown = true;
        keys.up.isDown = true;
        keys.right.isDown = true;

        expect(getInputFn(keys)()).toEqual({ height: -1, width: 1, x: 0, y: 0 });
    });

    test("Returns 10 * position delta if shift and cursors pressed", () => {
        keys.shift.isDown = true;
        keys.up.isDown = true;
        keys.right.isDown = true;

        expect(getInputFn(keys)()).toEqual({ height: 0, width: 0, x: 10, y: -10 });
    });
});
