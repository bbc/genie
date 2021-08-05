/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const isAudio = scene => name => Boolean(scene.config.background.audio.find(a => a.name === name));

export const createAudio = scene => name => {
	const config = scene.config.background.audio.find(a => a.name === name);
	const sound = scene.sound.add(config.key, config);
	sound.play(config);

	return sound;
};
