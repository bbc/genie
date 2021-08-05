/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

const isParticleManager = (found, child) => Boolean(child.emitters);
const matchesName = name => (found, child) => child.name === name;
const getChild = (found, child) => child;
const getEmitter = name => (found, child) => child.emitters.getByName(name) || found;

export const getNamed = name =>
	fp.cond([
		[matchesName(name), getChild],
		[isParticleManager, getEmitter(name)],
		[fp.stubTrue, found => found],
	]);
