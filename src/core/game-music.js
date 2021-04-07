/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";

const defaults = {
    duration: 1000,
    volume: 1,
};

let music;

const isPlaying = audioKey => audioKey && audioKey === music?.key;

const startNext = scene => {
    music?.destroy();
    music = start(scene, scene.config.music);
};

const start = (scene, audioKey) => {
    if (!audioKey) return;
    let sceneMusic = scene.sound.add(audioKey, { loop: true, volume: 0 }).play();
    scene.tweens.add({ ...defaults, targets: sceneMusic });

    return sceneMusic;
};

const fade = scene =>
    scene.tweens.add({
        targets: music,
        volume: 0,
        duration: defaults.duration / 2,
        onComplete: startNext.bind(this, scene),
    });

export const setMusic = fp.cond([
    [scene => isPlaying(scene.config.music) || scene._data.addedBy, fp.noop],
    [scene => !music || scene.scene.key === "home", startNext],
    [fp.stubTrue, fade],
]);
