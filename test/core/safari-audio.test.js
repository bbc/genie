/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addResumeSafariAudioContextEvent } from "../../src/core/safari-audio.js";

describe("Safari Audio Context", () => {
    let mockGame;

    beforeEach(() => {
        global.window.addEventListener = jest.fn();
        mockGame = {
            sound: {
                context: { state: "running", resume: jest.fn() },
            },
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test("adds a focus event listener on window", () => {
        addResumeSafariAudioContextEvent(mockGame);
        expect(global.window.addEventListener).toHaveBeenCalledWith("focus", expect.any(Function));
    });

    test("resumes audio context when blur event fired on window and audio context state is interrupted", () => {
        addResumeSafariAudioContextEvent(mockGame);
        mockGame.sound.context.state = "interrupted";
        const callback = global.window.addEventListener.mock.calls[0][1];
        callback();
        expect(mockGame.sound.context.resume).toHaveBeenCalled();
    });

    test("does not resume audio context when blur event fired on window and audio context state is not interrupted", () => {
        addResumeSafariAudioContextEvent(mockGame);
        const callback = global.window.addEventListener.mock.calls[0][1];
        callback();
        expect(mockGame.sound.context.resume).not.toHaveBeenCalled();
    });
});
