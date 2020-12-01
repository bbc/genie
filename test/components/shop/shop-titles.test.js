/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createTitle } from "../../../src/components/shop/shop-titles.js";
import * as titles from "../../../src/components/select/titles.js";
import * as layout from "../../../src/components/shop/shop-layout.js";
import * as scalerModule from "../../../src/core/scaler.js";

describe("createTitle", () => {
    let title;
    const mockMetrics = { foo: "bar" };
    const mockSafeArea = { baz: "qux" };
    scalerModule.getMetrics = jest.fn(() => mockMetrics);
    const mockText = { setText: jest.fn(), type: "Text" };
    const mockContainer = {
        add: jest.fn(),
        setScale: jest.fn(),
        setPosition: jest.fn(),
        list: [mockText],
    };
    const mockScene = {
        add: {
            container: jest.fn(() => mockContainer),
        },
        layout: {
            getSafeArea: jest.fn(() => mockSafeArea),
        },
    };
    layout.getYPos = jest.fn().mockReturnValue(13);
    layout.getScaleFactor = jest.fn().mockReturnValue(17);
    titles.createTitles = jest.fn().mockReturnValue("fakeTitle");

    beforeEach(() => (title = createTitle(mockScene)));

    afterEach(() => jest.clearAllMocks());

    test("instantiates a container", () => {
        expect(mockScene.add.container).toHaveBeenCalled();
    });
    test("adds titles from createTitles", () => {
        expect(titles.createTitles).toHaveBeenCalledWith(mockScene);
        expect(mockContainer.add).toHaveBeenCalledWith("fakeTitle");
    });
    test("sets position with an x of zero and a y from getYPos", () => {
        expect(mockContainer.setPosition.mock.calls[0][0]).toBe(0);
        expect(layout.getYPos).toHaveBeenCalled();
        expect(mockContainer.setPosition.mock.calls[0][1]).toBe(13);
    });
    test("sets scale according to getScaleFactor", () => {
        const expected = {
            metrics: mockMetrics,
            container: mockContainer,
            fixedWidth: true,
            safeArea: mockSafeArea,
        };
        expect(layout.getScaleFactor.mock.calls[0][0]).toStrictEqual(expected);
        expect(mockContainer.setScale).toHaveBeenCalledWith(17);
    });
    test("decorates the container with a setTitleText function", () => {
        expect(typeof mockContainer.setTitleText).toBe("function");
    });
    test("which updates the string the text is derived from", () => {
        title.setTitleText("foo");
        expect(mockText.setText).toHaveBeenCalledWith("Foo");
    });
});
