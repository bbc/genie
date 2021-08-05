/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi";

import * as settingsIcons from "../../../src/core/layout/settings-icons.js";
import { eventBus } from "../../../src/core/event-bus.js";

describe("Layout - Settings Icons", () => {
	let mockGmi;
	let mockGroup;
	let unsubscribeSpy;

	beforeEach(() => {
		mockGmi = {
			getAllSettings: jest.fn(() => ({ motion: "motion-data", audio: "audio-data" })),
		};
		createMockGmi(mockGmi);
		mockGroup = {
			addButton: jest.fn(),
			removeButton: jest.fn(),
			reset: jest.fn(),
			length: 1,
		};
		unsubscribeSpy = jest.fn();
		jest.spyOn(eventBus, "publish").mockImplementation(() => {});
		jest.spyOn(eventBus, "subscribe").mockImplementation(() => ({ unsubscribe: unsubscribeSpy }));
	});

	afterEach(() => jest.clearAllMocks());

	describe("Event Publishing", () => {
		beforeEach(() => settingsIcons.create(mockGroup, []));

		test("publishes events for motion", () => {
			const motionParams = eventBus.publish.mock.calls[0][0];
			expect(motionParams.channel).toBe("genie-settings");
			expect(motionParams.name).toBe("motion");
			expect(motionParams.data).toBe("motion-data");
		});

		test("publishes events for audio", () => {
			const audioParams = eventBus.publish.mock.calls[1][0];
			expect(audioParams.channel).toBe("genie-settings");
			expect(audioParams.name).toBe("audio");
			expect(audioParams.data).toBe("audio-data");
		});
	});

	describe("Event Unsubscribing", () => {
		beforeEach(() => {
			const createdSettingsIcons = settingsIcons.create(mockGroup, []);
			createdSettingsIcons.unsubscribe();
		});

		test("unsubscribes from each button event", () => {
			expect(unsubscribeSpy).toHaveBeenCalledTimes(2);
		});
	});

	describe("Motion FX Button Subscription", () => {
		test("has a event subscription with correct name and channel", () => {
			settingsIcons.create(mockGroup, ["audio"]);
			expect(eventBus.subscribe).toHaveBeenCalledTimes(1);
			const actualParams = eventBus.subscribe.mock.calls[0][0];
			expect(actualParams.channel).toBe("genie-settings");
			expect(actualParams.name).toBe("motion");
		});

		describe("Motion FX callback creates button icon", () => {
			test("adds the button icon to the group when the event callback is fired", () => {
				settingsIcons.create(mockGroup, ["audio"]);
				const iconExists = false;
				const callback = eventBus.subscribe.mock.calls[0][0].callback;
				callback(iconExists);

				expect(mockGroup.addButton).toHaveBeenCalledTimes(1);
				const actualParams = mockGroup.addButton.mock.calls[0];
				expect(actualParams[0]).toEqual({
					title: "FX Off",
					key: "fx-off-icon",
					id: "fx-off",
					eventName: "motion",
					icon: true,
				});
				expect(actualParams[1]).toEqual(0);
			});

			test("does not add the button icon to the very end of the group when there are are other buttons", () => {
				mockGroup.length = 4;
				settingsIcons.create(mockGroup, ["audio"]);
				const iconExists = false;
				const callback = eventBus.subscribe.mock.calls[0][0].callback;
				callback(iconExists);

				const expectedPosition = 0;
				expect(mockGroup.addButton.mock.calls[0][1]).toEqual(expectedPosition);
			});

			test("resets the group when the event callback is fired", () => {
				settingsIcons.create(mockGroup, ["audio"]);
				const iconExists = false;
				const callback = eventBus.subscribe.mock.calls[0][0].callback;
				callback(iconExists);

				expect(mockGroup.reset).toHaveBeenCalledTimes(1);
			});
		});

		describe("Motion FX callback removes button icon", () => {
			beforeEach(() => {
				settingsIcons.create(mockGroup, ["audio"]);
				const iconExists = true;
				mockGroup.addButton.mockImplementation(() => "motion-fx-icon");
				const callback = eventBus.subscribe.mock.calls[0][0].callback;
				callback(false); // creates button icon
				callback(iconExists);
			});

			test("removes the button icon from the group when the event callback is fired", () => {
				expect(mockGroup.removeButton).toHaveBeenCalledTimes(1);
				const actualParams = mockGroup.removeButton.mock.calls[0][0];
				expect(actualParams).toBe("motion-fx-icon");
			});

			test("resets the group when the event callback is fired again", () => {
				expect(mockGroup.reset).toHaveBeenCalledTimes(2);
			});
		});

		describe("Motion FX callback does not alter group", () => {
			let callback;

			beforeEach(() => {
				settingsIcons.create(mockGroup, ["audio"]);
				mockGroup.addButton.mockImplementation(() => "motion-fx-icon");
				callback = eventBus.subscribe.mock.calls[0][0].callback;
			});

			test("does not add/remove button icon when callback is passed true but icon does not exist", () => {
				callback(true);
				expect(mockGroup.addButton).not.toHaveBeenCalled();
				expect(mockGroup.removeButton).not.toHaveBeenCalled();
				expect(mockGroup.reset).toHaveBeenCalledTimes(1);
			});

			test("does not add/remove button icon when icon exists but calback is passed false", () => {
				callback(false); // creates icon
				callback(false);
				expect(mockGroup.addButton).toHaveBeenCalledTimes(1);
				expect(mockGroup.removeButton).not.toHaveBeenCalled();
				expect(mockGroup.reset).toHaveBeenCalledTimes(2);
			});
		});
	});

	describe("Audio Button Subscription", () => {
		test("gets a event subscription when not already included in the buttons list", () => {
			settingsIcons.create(mockGroup, []);
			expect(eventBus.subscribe).toHaveBeenCalledTimes(2);
		});

		test("has a event subscription with correct name and channel", () => {
			settingsIcons.create(mockGroup, []);
			const actualParams = eventBus.subscribe.mock.calls[1];
			expect(actualParams[0].channel).toEqual("genie-settings");
			expect(actualParams[0].name).toEqual("audio");
		});

		describe("Audio callback creates button icon", () => {
			test("adds the button icon to the group when the event callback is fired", () => {
				settingsIcons.create(mockGroup, []);
				const iconExists = false;
				const callback = eventBus.subscribe.mock.calls[1][0].callback;
				callback(iconExists);

				expect(mockGroup.addButton).toHaveBeenCalledTimes(1);
				const actualParams = mockGroup.addButton.mock.calls[0];
				expect(actualParams[0]).toEqual({
					title: "Audio Off",
					key: "audio-off-icon",
					id: "audio-off",
					eventName: "audio",
					icon: true,
				});
				expect(actualParams[1]).toEqual(0);
			});

			test("adds the button icon to the very end of the group when there are are other buttons", () => {
				mockGroup.length = 4;
				settingsIcons.create(mockGroup, []);
				const iconExists = false;
				const callback = eventBus.subscribe.mock.calls[1][0].callback;
				callback(iconExists);

				const expectedPosition = 3;
				expect(mockGroup.addButton.mock.calls[0][1]).toEqual(expectedPosition);
			});

			test("resets the group when the event callback is fired", () => {
				settingsIcons.create(mockGroup, []);
				const iconExists = false;
				const callback = eventBus.subscribe.mock.calls[0][0].callback;
				callback(iconExists);

				expect(mockGroup.reset).toHaveBeenCalledTimes(1);
			});
		});

		describe("Audio callback removes button icon", () => {
			beforeEach(() => {
				settingsIcons.create(mockGroup, []);
				const iconExists = true;
				mockGroup.addButton.mockImplementation(() => "audio-icon");
				const callback = eventBus.subscribe.mock.calls[0][0].callback;
				callback(false); // creates button icon
				callback(iconExists);
			});

			test("removes the button icon from the group when the event callback is fired", () => {
				expect(mockGroup.removeButton).toHaveBeenCalledTimes(1);
				const actualParams = mockGroup.removeButton.mock.calls[0];
				expect(actualParams[0]).toEqual("audio-icon");
			});

			test("resets the group when the event callback is fired again", () => {
				expect(mockGroup.reset).toHaveBeenCalledTimes(2);
			});
		});

		describe("Audio callback does not alter group", () => {
			let callback;

			beforeEach(() => {
				settingsIcons.create(mockGroup, []);
				mockGroup.addButton.mockImplementation(() => "audio-icon");
				callback = eventBus.subscribe.mock.calls[1][0].callback;
			});

			test("does not add/remove button icon when callback is passed true but icon does not exist", () => {
				callback(true);
				expect(mockGroup.addButton).not.toHaveBeenCalled();
				expect(mockGroup.removeButton).not.toHaveBeenCalled();
				expect(mockGroup.reset).toHaveBeenCalledTimes(1);
			});

			test("does not add/remove button icon when icon exists but calback is passed false", () => {
				callback(false); // creates icon
				callback(false);
				expect(mockGroup.addButton).toHaveBeenCalledTimes(1);
				expect(mockGroup.removeButton).not.toHaveBeenCalled();
				expect(mockGroup.reset).toHaveBeenCalledTimes(2);
			});
		});
	});
});
