/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Home } from "../../src/components/home.js";
import { Loader } from "../../src/core/loader/loader.js";
import * as Navigation from "../../src/core/navigation.js";
import * as signal from "../../src/core/signal-bus.js";

describe("Navigation", () => {
    let gameState, context, layoutManager, navigationConfig, transientData, navigation;

    beforeEach(() => {
        gameState = {
            add: jest.fn(),
            start: jest.fn(),
            game: { paused: true },
        };
        context = jest.fn();
        layoutManager = { removeAll: jest.fn() };
        transientData = undefined;
        navigation = {
            loadscreen: {
                state: Loader,
                routes: {
                    next: jest.fn(),
                },
            },
            home: {
                state: Home,
                routes: {
                    next: jest.fn(),
                },
            },
        };
        navigationConfig = () => navigation;
        jest.spyOn(signal.bus, "removeChannel");
    });

    afterEach(() => jest.clearAllMocks());

    test("loads correct genie screens", () => {
        Navigation.create(gameState, context, layoutManager, navigationConfig);

        expect(gameState.add).toHaveBeenCalledTimes(2);
        expect(gameState.add).toHaveBeenCalledWith("loadscreen", Loader);
        expect(gameState.add).toHaveBeenCalledWith("home", Home);
    });

    test("goes to loadscreen", () => {
        Navigation.create(gameState, context, layoutManager, navigationConfig);

        expect(gameState.start).toHaveBeenCalledTimes(1);
        expect(gameState.start).toHaveBeenCalledWith(
            "loadscreen",
            true,
            false,
            transientData,
            layoutManager,
            context,
            navigation,
        );
    });

    test("ensures the game is unpaused", () => {
        Navigation.create(gameState, context, layoutManager, navigationConfig);

        expect(gameState.game.paused).toBe(false);
    });

    test("removes signal bus gel-buttons channel before going to screen", () => {
        Navigation.create(gameState, context, layoutManager, navigationConfig);

        expect(signal.bus.removeChannel).toHaveBeenCalledTimes(1);
        expect(signal.bus.removeChannel).toHaveBeenCalledWith("gel-buttons");
    });

    test("clears down layout before going to screen", () => {
        Navigation.create(gameState, context, layoutManager, navigationConfig);

        expect(layoutManager.removeAll).toHaveBeenCalledTimes(1);
    });

    test("It returns a function", () => {
        expect(typeof Navigation.create(gameState, context, layoutManager, navigationConfig)).toBe("function");
    });
});
