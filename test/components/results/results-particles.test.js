/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../../src/core/gmi/gmi.js";
import { addParticlesToRows } from "../../../src/components/results/results-particles.js";

jest.mock("../../../src/core/gmi/gmi.js");

describe("ResultsRow - Particles", () => {
	let mockScene;
	let mockParticles;
	let mockEmitter;
	let mockEmitterConfig;
	let mockParticlesConfig;
	let mockContainers;
	let mockSettings;

	beforeEach(() => {
		mockEmitterConfig = {
			lifespan: 800,
		};
		mockParticles = {
			createEmitter: jest.fn(() => mockEmitter),
			setDepth: jest.fn(() => mockParticles),
		};
		mockEmitter = {
			setPosition: jest.fn(() => mockEmitter),
			stop: jest.fn(() => mockEmitter),
			start: jest.fn(),
		};
		mockScene = {
			add: { particles: jest.fn(() => mockParticles) },
			cache: { json: { get: jest.fn(() => mockEmitterConfig) } },
			time: { addEvent: jest.fn() },
		};
		mockParticlesConfig = [{ assetKey: "test", emitterConfigKey: "config", delay: 2000, duration: 1000 }];
		mockContainers = [{ rowConfig: { particles: mockParticlesConfig }, x: 23, y: 128 }];
		mockSettings = { motion: true };
		gmi.getAllSettings = jest.fn(() => mockSettings);
	});

	afterEach(() => jest.clearAllMocks());

	test("sets up particles as specified in config", () => {
		addParticlesToRows(mockScene, mockContainers);
		expect(mockScene.add.particles).toHaveBeenCalledWith(mockParticlesConfig[0].assetKey);
	});

	test("sets up particles with a depth of 0 by default", () => {
		addParticlesToRows(mockScene, mockContainers);
		expect(mockParticles.setDepth).toHaveBeenCalledWith(0);
	});

	test("sets up particles with a depth of 1 when onTop is true", () => {
		mockParticlesConfig[0].onTop = true;
		addParticlesToRows(mockScene, mockContainers);
		expect(mockParticles.setDepth).toHaveBeenCalledWith(1);
	});

	test("sets up particles with a depth of 0 when onTop is false", () => {
		mockParticlesConfig[0].onTop = false;
		addParticlesToRows(mockScene, mockContainers);
		expect(mockParticles.setDepth).toHaveBeenCalledWith(0);
	});

	test("gets the emitter config using the emitterConfigKey", () => {
		addParticlesToRows(mockScene, mockContainers);
		expect(mockScene.cache.json.get).toHaveBeenCalledWith(mockParticlesConfig[0].emitterConfigKey);
	});

	test("creates an emitter using the emitter config", () => {
		addParticlesToRows(mockScene, mockContainers);
		expect(mockParticles.createEmitter).toHaveBeenCalledWith(mockEmitterConfig);
	});

	test("sets position of emitter to the containers position when no offset is provided", () => {
		addParticlesToRows(mockScene, mockContainers);
		expect(mockEmitter.setPosition).toHaveBeenCalledWith(mockContainers[0].x, mockContainers[0].y);
	});

	test("offsets the position of the emitter when an offset is provided", () => {
		mockParticlesConfig[0].offsetX = 20;
		mockParticlesConfig[0].offsetY = 23;
		addParticlesToRows(mockScene, mockContainers);
		expect(mockEmitter.setPosition).toHaveBeenCalledWith(mockContainers[0].x + 20, mockContainers[0].y + 23);
	});

	test("initially calls stop on the newly created emitter", () => {
		addParticlesToRows(mockScene, mockContainers);
		expect(mockEmitter.stop).toHaveBeenCalled();
	});

	test("adds an event to start the emitter", () => {
		addParticlesToRows(mockScene, mockContainers);
		mockScene.time.addEvent.mock.calls[0][0].callback();
		expect(mockScene.time.addEvent).toHaveBeenCalledWith({
			delay: mockParticlesConfig[0].delay,
			callback: expect.any(Function),
		});
		expect(mockEmitter.start).toHaveBeenCalled();
	});

	test("adds an event to start the emitter with 0 delay when no delay is provided", () => {
		delete mockParticlesConfig[0].delay;
		addParticlesToRows(mockScene, mockContainers);
		mockScene.time.addEvent.mock.calls[0][0].callback();
		expect(mockScene.time.addEvent).toHaveBeenCalledWith({
			delay: 0,
			callback: expect.any(Function),
		});
		expect(mockEmitter.start).toHaveBeenCalled();
	});

	test("adds an event to stop the emitter", () => {
		addParticlesToRows(mockScene, mockContainers);
		const callback = mockScene.time.addEvent.mock.calls[1][0].callback;
		expect(mockScene.time.addEvent).toHaveBeenCalledWith({
			delay: mockParticlesConfig[0].delay + mockParticlesConfig[0].duration,
			callback: expect.any(Function),
		});
		jest.resetAllMocks();
		callback();
		expect(mockEmitter.stop).toHaveBeenCalled();
	});

	test("does not add an event to stop the emitter when no duration is provided", () => {
		delete mockParticlesConfig[0].duration;
		addParticlesToRows(mockScene, mockContainers);
		const callback = mockScene.time.addEvent.mock.calls[0][0].callback;
		expect(mockScene.time.addEvent).toHaveBeenCalledTimes(1);
		jest.resetAllMocks();
		callback();
		expect(mockEmitter.stop).not.toHaveBeenCalled();
	});
});
