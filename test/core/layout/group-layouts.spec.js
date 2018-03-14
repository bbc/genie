import { assert } from "chai";
import * as fp from "lodash/fp";
import { isBoolean, isUndefined } from "util";
import { groupLayouts } from "../../../src/core/layout/group-layouts";

describe("Group Layouts", () => {
    it("matches the test constant", () => {
        const expectedGroupLayouts = [
            { vPos: "top", hPos: "left" },
            { vPos: "top", hPos: "right" },
            { vPos: "bottom", hPos: "left" },
            { vPos: "bottom", hPos: "right" },
            { vPos: "middle", hPos: "left" },
            { vPos: "middle", hPos: "right" },
            { vPos: "bottom", hPos: "center" },
            { vPos: "middle", hPos: "center" },
            { vPos: "middle", hPos: "center", arrangeV: true },
        ];
        assert.isTrue(fp.isEqual(expectedGroupLayouts, groupLayouts));
    });
});
