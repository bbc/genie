/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../../src/core/gmi/gmi.js";
import { addHoverParticlesToCells } from "../../../src/components/select/select-particles.js";

jest.mock("../../../src/core/gmi/gmi.js");

describe("Select Screen - Particles", () => {
	let mockScene;
	let mockCells;
	let mockEmitter;
	let mockEmitterConfig;
	let mockSettings;
	let mockButton;
	let mockConfig;
	let mockLayoutRoot;

	beforeEach(() => {
		mockConfig = {
			assetKey: "mock asset key",
			emitterConfigKey: "mock emitter config key",
		};
		mockLayoutRoot = { setDepth: jest.fn() };
		mockButton = { on: jest.fn(), x: 23, y: 132, listeners: jest.fn(() => ["mock listener"]) };
		mockCells = [{ button: mockButton }];
		mockEmitterConfig = {
			lifespan: 800,
		};
		mockEmitter = {
			setPosition: jest.fn(() => mockEmitter),
			stop: jest.fn(() => mockEmitter),
		};
		mockScene = {
			add: { particles: jest.fn(() => mockEmitter) },
			cache: { json: { get: jest.fn(() => mockEmitterConfig) } },
		};
		mockSettings = { motion: true };
		gmi.getAllSettings = jest.fn(() => mockSettings);
	});

	afterEach(() => jest.clearAllMocks());

	test("sets up particles as specified in config when pointer over event is fired", () => {
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		mockButton.on.mock.calls[0][1]();
		expect(mockButton.on.mock.calls[0][0]).toBe(Phaser.Input.Events.POINTER_OVER);
		expect(mockScene.add.particles).toHaveBeenCalledWith(0, 0, mockConfig.assetKey, mockEmitterConfig);
	});

	test("does not setup pointer listeners on buttons when no config is provided", () => {
		addHoverParticlesToCells(mockScene, mockCells, undefined, mockLayoutRoot);
		expect(mockButton.on).not.toHaveBeenCalled();
	});

	test("does not setup pointer listeners on buttons when motion is disabled", () => {
		mockSettings.motion = false;
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		expect(mockButton.on).not.toHaveBeenCalled();
	});

	test("gets the emitter config using the emitterConfigKey when pointer over event is fired", () => {
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		mockButton.on.mock.calls[0][1]();
		expect(mockButton.on.mock.calls[0][0]).toBe(Phaser.Input.Events.POINTER_OVER);
		expect(mockScene.cache.json.get).toHaveBeenCalledWith(mockConfig.emitterConfigKey);
	});

	test("creates an emitter using the emitter config when pointer over event is fired", () => {
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		mockButton.on.mock.calls[0][1]();
		expect(mockButton.on.mock.calls[0][0]).toBe(Phaser.Input.Events.POINTER_OVER);

		expect(mockScene.add.particles).toHaveBeenCalledWith(0, 0, mockConfig.assetKey, mockEmitterConfig);
	});

	test("does not create an emitter when pointer over event is fired and button is disabled", () => {
		mockButton.listeners = jest.fn(() => []);
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		mockButton.on.mock.calls[0][1]();
		expect(mockButton.on.mock.calls[0][0]).toBe(Phaser.Input.Events.POINTER_OVER);
		expect(mockScene.add.particles).not.toHaveBeenCalledWith(mockEmitterConfig);
	});

	test("sets the position of the emitter to the position of the button when pointer over event is fired", () => {
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		mockButton.on.mock.calls[0][1]();
		expect(mockButton.on.mock.calls[0][0]).toBe(Phaser.Input.Events.POINTER_OVER);
		expect(mockEmitter.setPosition).toHaveBeenCalledWith(mockButton.x, mockButton.y);
	});

	test("adds a pointer out event to the button which stops the emitter when pointer over event is fired", () => {
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		mockButton.on.mock.calls[0][1]();
		expect(mockButton.on.mock.calls[0][0]).toBe(Phaser.Input.Events.POINTER_OVER);
		expect(mockButton.on.mock.calls[1][0]).toBe(Phaser.Input.Events.POINTER_OUT);
		mockButton.on.mock.calls[1][1]();
		expect(mockEmitter.stop).toHaveBeenCalled();
	});

	test("does not add a pointer out event to the button when pointer over event is fired and button is disabled", () => {
		mockButton.listeners = jest.fn(() => []);
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		mockButton.on.mock.calls[0][1]();
		expect(mockButton.on.mock.calls[0][0]).toBe(Phaser.Input.Events.POINTER_OVER);
		expect(mockButton.on).toHaveBeenCalledTimes(1);
	});

	test("sets layoutRoot depth to 1 when config.onTop is undefined", () => {
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		expect(mockLayoutRoot.setDepth).toHaveBeenCalledWith(1);
	});

	test("sets layoutRoot depth to 0 when config.onTop is true", () => {
		mockConfig.onTop = true;
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		expect(mockLayoutRoot.setDepth).toHaveBeenCalledWith(0);
	});

	test("sets layoutRoot depth to 1 when config.onTop is false", () => {
		mockConfig.onTop = false;
		addHoverParticlesToCells(mockScene, mockCells, mockConfig, mockLayoutRoot);
		expect(mockLayoutRoot.setDepth).toHaveBeenCalledWith(1);
	});
});
