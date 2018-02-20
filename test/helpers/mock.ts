import * as _ from "lodash";
import * as sinon from "sinon";

import { Screen } from "../../src/core/screen";
import { ScreenDef } from "../../src/core/sequencer";

const TEST_DIV_ID = "test-div";

export function screenDef(name: string = "__screen_id__"): ScreenDef {
    return {
        name,
        state: screen(),
        nextScreenName: _.constant(name),
    };
}

export function screen(): Screen {
    return sinon.createStubInstance(Screen);
}

export function installMockGetGmi(propertiesToMerge: any = {}) {
    uninstallMockGetGmi();
    document.body.appendChild(document.createElement("div")).id = TEST_DIV_ID;
    (window as any).getGMI = () => gmi(propertiesToMerge);
}

export function gmi(propertiesToMerge: any = {}): Gmi {
    const defaultGmi = {
        gameContainerId: TEST_DIV_ID,
        embedVars: { configPath: "" },
    };
    return _.merge(defaultGmi, propertiesToMerge) as Gmi;
}

export function uninstallMockGetGmi() {
    try {
        document.body.removeChild(getGameHolderDiv());
    } catch (e) {}
}

export function getGameHolderDiv() {
    return getElementOrThrow(TEST_DIV_ID);
}

function getElementOrThrow(id: string): HTMLElement {
    const e = document.getElementById(id);
    if (e) {
        return e;
    } else {
        throw Error("Didn't find " + id);
    }
}
