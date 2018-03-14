import * as _ from "lodash";
import * as sinon from "sinon";

import { Screen } from "../../src/core/screen";

const TEST_DIV_ID = "test-div";

export function screenDef(name = "__screen_id__") {
    return {
        name,
        state: screen(),
        nextScreenName: _.constant(name),
    };
}

export function screen() {
    return sinon.createStubInstance(Screen);
}

export function installMockGetGmi(propertiesToMerge = {}) {
    uninstallMockGetGmi();
    document.body.appendChild(document.createElement("div")).id = TEST_DIV_ID;
    window.getGMI = () => gmi(propertiesToMerge);
}

export function gmi(propertiesToMerge = {}) {
    const defaultGmi = {
        gameContainerId: TEST_DIV_ID,
        embedVars: { configPath: "" },
    };
    return _.merge(defaultGmi, propertiesToMerge);
}

export function uninstallMockGetGmi() {
    try {
        document.body.removeChild(getGameHolderDiv());
    } catch (e) {}
}

export function getGameHolderDiv() {
    return getElementOrThrow(TEST_DIV_ID);
}

function getElementOrThrow(id) {
    const e = document.getElementById(id);
    if (e) {
        return e;
    } else {
        throw Error("Didn't find " + id);
    }
}
