import { expect } from "chai";
// import * as sinon from "sinon";
import { Screen } from "../../src/core/screen";
import * as Game from "../fake/game.js";
import * as Scene from "../fake/scene.js";

describe("Screen", () => {
    describe("with no overlays", () => {
        beforeEach(() => {
            screen = new Screen();
            const mockContext = { popupScreens: [] };
            const mockNavigation = { loadscreen: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "loadscreen";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("returns the screen name as the visible layer", () => {
            expect(screen.visibleLayer).to.eql("loadscreen");
        });
    });

    describe("with one overlay", () => {
        beforeEach(() => {
            screen = new Screen();
            const mockContext = { popupScreens: ["pause"] };
            const mockNavigation = { game: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "game";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("returns the overlay name as the visible layer", () => {
            expect(screen.visibleLayer).to.eql("pause");
        });
    });

    describe("with two overlays", () => {
        beforeEach(() => {
            screen = new Screen();
            const mockContext = { popupScreens: ["pause", "howToPlay"] };
            const mockNavigation = { game: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "game";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("returns the top overlay name (last in the array) as the visible layer", () => {
            expect(screen.visibleLayer).to.eql("howToPlay");
        });
    });
});

//     let screen;
//     let mockScene;
//     let transientData;
//     let navigation;

//     const mockContext = {
//         popUpScreens:
//     };
//     const sandbox = sinon.sandbox.create();

//     beforeEach(() => {
//         mockScene = sandbox.spy();
//         transientData = sandbox.stub();
//         navigation = {
//             loadscreen: sandbox.stub(),
//         };

//         screen = new Screen();
//         screen.game = {
//             state: {
//                 current: "loadscreen",
//             },
//         };
//         screen.init(transientData, mockScene, mockContext, navigation);
//     });

//     afterEach(() => {
//         sandbox.restore();
//     });

//     it("sets scene on the screen", () => {
//         expect(screen.scene).to.eql(mockScene);
//     });

//     it("sets the context on the screen", () => {
//         expect(screen._context).to.eql(mockContext);
//     });

//     describe("context", () => {
//         it("has a getter", () => {
//             expect(screen.context).to.eql(mockContext);
//         });

//         it("has a setter", () => {
//             const expectedContext = {
//                 qaMode: { active: true },
//             };
//             screen.context.qaMode = { active: true };
//             expect(screen.context).to.eql(expectedContext);
//         });
//     });
// });
