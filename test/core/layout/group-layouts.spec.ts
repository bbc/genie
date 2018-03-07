import { expect } from "chai";
import * as fp from "lodash/fp";
import { isBoolean, isUndefined } from "util";
import { groupLayouts } from "../../../src/core/layout/group-layouts";

describe("Group Layouts", () => {

    it("has only unique layout positions", () => {
        expect(fp.uniqWith(fp.isEqual, groupLayouts))
        .to.have.members(groupLayouts);
    });

    it("has vertical positions of either top, middle or bottom", () => {
        expect(groupLayouts.filter(
            (v, k, a) => ["top", "middle", "bottom"].indexOf(v.vPos) >= 0),
        )
        .to.have.members(groupLayouts);
    });

    it("has horizontal positions of either left, center or right", () => {
        expect(groupLayouts.filter(
            (v, k, a) => ["left", "center", "right"].indexOf(v.hPos) >= 0),
        )
        .to.have.members(groupLayouts);
    });

    it("has an optional arrangeV property of either true or false", () => {
        expect(groupLayouts.filter(
            (v, k, a) => !isUndefined(v.arrangeV) && isBoolean(v.arrangeV)),
        )
        .to.have.members(groupLayouts.filter(
            (v, k, a) => !isUndefined(v.arrangeV)),
        );
    });

});
