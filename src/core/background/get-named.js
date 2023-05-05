/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

const isParticleEmitter = (found, child) => child instanceof Phaser.GameObjects.Particles.ParticleEmitter;
const matchesName = name => (found, child) => child.name === name;
const getChild = (found, child) => child;

export const getNamed = name =>
	fp.cond([
		[matchesName(name), getChild],
		[isParticleEmitter, getChild],
		[fp.stubTrue, found => found],
	]);
