import { Startup as _Startup } from "./core-state";
import { doubleNumber as _doubleNumber } from "./math";

export namespace GenieCore {
    export namespace States {
        export const Startup = _Startup;
        export type Startup = _Startup;
    }
    export namespace Maths {
        export const doubleNumber = _doubleNumber;
    }
}
