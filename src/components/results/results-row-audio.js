/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const playRowAudio = (scene, containers) => {
    containers.forEach(row => {
        const config = row.rowConfig;
        if (config.audio) {
            scene.time.addEvent({
                delay: config.audio.delay,
                callback: () => scene.sound.play(config.audio.key),
            });
        }
    });
};
