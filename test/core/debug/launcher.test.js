/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "../../../src/core/debug/launcher.js";

describe("Examples Launcher", () => {
    let launcher;

    beforeEach(() => {
        launcher = new Launcher();

        const mockButton = {
            config: {
                id: "testButton",
            },
            overlays: { set: jest.fn() },
            scene: {
                scene: {
                    key: "testKey",
                },
                sys: { scale: { parent: "mockParent" }, accessibleButtons: [] },
            },
        };

        launcher.add = {
            image: jest.fn(),
            text: jest.fn(() => ({
                setOrigin: jest.fn(),
            })),
            gelButton: jest.fn(() => mockButton),
        };
        launcher.setLayout = jest.fn();
        launcher.navigation = { next: jest.fn(), select1: jest.fn(), selectGrid: jest.fn() };
        launcher.scene = {
            key: "launcher",
        };
    });

    describe("create method", () => {
        beforeEach(() => {
            launcher.create();
        });

        test("Intentionally loose test as page not included in final output", () => {
            expect(launcher.add.image).toHaveBeenCalled();
            expect(launcher.add.gelButton).toHaveBeenCalled();
            expect(launcher.setLayout).toHaveBeenCalledWith(["home"]);
        });
    });
});
