import { Loadscreen } from "../loadscreen.js";
import { Home } from "../home.js";
import { RotationTest } from "./test-screens/rotation.js";
import { CollisionTest } from "./test-screens/collision.js";
import { TweeningTest } from "./test-screens/tweening.js";
import { FpsTest } from "./test-screens/fps.js";

export const phaserTestHarnessConfig = goToScreen => {
    const goToHome = data => goToScreen("home", data);
    const goToRotation = data => goToScreen("rotation", data);
    const goToCollision = data => goToScreen("collision", data);
    const goToTweening = data => goToScreen("tweening", data);
    const goToFpsTest = data => goToScreen("fps", data);

    return {
        loadscreen: {
            state: Loadscreen,
            routes: {
                next: goToHome,
            },
        },
        home: {
            state: Home,
            routes: {
                next: goToRotation,
            },
        },
        rotation: {
            state: RotationTest,
            routes: {
                next: goToCollision,
                home: goToHome,
                restart: goToHome,
            },
        },
        collision: {
            state: CollisionTest,
            routes: {
                next: goToTweening,
                home: goToHome,
                restart: goToHome,
            },
        },
        tweening: {
            state: TweeningTest,
            routes: {
                next: goToFpsTest,
                home: goToHome,
                restart: goToHome,
            },
        },
        fps: {
            state: FpsTest,
            routes: {
                next: goToHome,
                home: goToHome,
                restart: goToHome,
            },
        },
    };
};
