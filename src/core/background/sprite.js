/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../gmi/gmi.js";

const spriteDefaults = {
    x: 0,
    y: 0,
    scale: 1,
    frames: { default: 0, repeat: -1, rate: 10 },
};

export const isSprite = scene => config => scene.textures.exists(config.key) && Boolean(config.frames);

export const addSprite = scene => animConfig => {
    const config = {
        ...spriteDefaults,
        ...animConfig,
        ...{ frames: { ...spriteDefaults.frames, ...animConfig.frames } },
    };
    const animation = scene.add.sprite(config.x, config.y, config.key, config.frames.default);

    config.props && Object.assign(animation, config.props);

    scene.anims.create({
        key: config.frames.key,
        frames: scene.anims.generateFrameNumbers(config.key, { start: config.frames.start, end: config.frames.end }),
        frameRate: config.frames.rate,
        repeat: config.frames.repeat,
    });

    if (gmi.getAllSettings().motion) {
        animation.play(config.frames.key);
    }
};
