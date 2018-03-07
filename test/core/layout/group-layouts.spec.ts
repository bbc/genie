import { assert } from "chai";
import * as fp from "lodash/fp";
import { isBoolean, isUndefined } from "util";
import { groupLayouts } from "../../../src/core/layout/group-layouts";

describe.only("Group Layouts", () => {

    it("has only unique layout positions", () => {
        expect(fp.uniqWith(fp.isEqual, groupLayouts))
        .to.have.members(groupLayouts);
    });

    it("has vertical positions of either top, middle or bottom", () => {
        assert.isEmpty(fp.filter(
            fp.negate(fp.includes(fp, ["top", "middle", "bottom"])),
            fp.map(g => g.vPos, groupLayouts),
        ));
    });

    it("has horizontal positions of either left, center or right", () => {
        assert.isEmpty(fp.filter(
            fp.negate(fp.includes(fp, ["left", "center", "right"])),
            fp.map(g => g.hPos, groupLayouts),
        ));
    });

    it("has an optional arrangeV property of either true or false", () => {
        assert.isEmpty(fp.filter(
            fp.flow(isUndefined, fp.negate(isBoolean)),
            groupLayouts,
        ));
    });

});
