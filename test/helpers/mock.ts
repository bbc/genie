/// <reference path="../../src/lib/gmi.d.ts" />

const TEST_DIV_ID = "test-div";

export function installMockGetGmi() {
    document.body.appendChild(document.createElement("div")).id = TEST_DIV_ID;
    (window as any).getGMI = () => {
        return {
            gameContainerId: TEST_DIV_ID,
            embedVars: { configPath: "" },
        } as Gmi;
    };
}

export function uninstallMockGetGmi() {
    document.body.removeChild(getElementOrThrow(TEST_DIV_ID));
}

function getElementOrThrow(id: string): HTMLElement {
    const e = document.getElementById(id);
    if (e) {
        return e;
    } else {
        throw Error("Didn't find " + id);
    }
}
