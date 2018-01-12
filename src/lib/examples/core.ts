import { Startup as StartupState } from "./core-state";
import { doubleNumber as doubleNumberFunction } from "./math";

export module GenieCore {
    export namespace States {
        export const Startup = StartupState;
        export type Startup = StartupState;
    }
    export namespace Maths {
        export const doubleNumber = doubleNumberFunction;
    }
}
