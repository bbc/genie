/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

const spineDefaults = {
    x: 0,
    y: 0,
    animationName: "default",
    loop: true,
};

const spriteDefaults = {
    x: 0,
    y: 0,
    scale: 1,
    frames: { default: 0, repeat: -1, rate: 10 },
};

const addSpine = scene => animConfig => {
    const config = Object.assign({}, spineDefaults, animConfig);
    const animation = scene.add.spine(config.x, config.y, config.key, config.animationName, config.loop);

    config.props && Object.assign(animation, config.props);

    animation.active = gmi.getAllSettings().motion;
};

const addSprite = scene => animConfig => {
    const config = Object.assign({}, spriteDefaults, animConfig);
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

const addParticles = scene => config => {
    const particles = scene.add.particles(config.assetKey);
    particles.createEmitter(scene.cache.json.get(config.key));
}


const isSpine = scene => config => scene.cache.custom.spine.exists(config.key);
const isSprite = scene => config => scene.textures.exists(config.key);
const isParticles = scene => config => scene.cache.json.exists(config.key); //TODO should particles use a custom cache?

export const addAnimations = scene => () => {
    const configs = scene.context.theme.animations || [];
    const conditionPairs = [
        [isSpine(scene), addSpine(scene)],
        [isSprite(scene), addSprite(scene)],
        [isParticles(scene), addParticles(scene)],
    ];
    const dispatcher = fp.cond(conditionPairs);
    configs.forEach(dispatcher);
};
