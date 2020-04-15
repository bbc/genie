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

const imageDefaults = {
    x: 0,
    y: 0,
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

const addImage = scene => imageConfig => {
    const config = Object.assign({}, imageDefaults, imageConfig);
    const image = scene.add.image(config.x, config.y, config.key);

    config.props && Object.assign(image, config.props);
};

const addParticles = scene => config => {
    if (!gmi.getAllSettings().motion) return;

    const particles = scene.add.particles(config.assetKey);
    const props = config.props || {};
    const emitterConfig = { ...scene.cache.json.get(config.key), ...props };

    particles.createEmitter(emitterConfig);
};

const isSpine = scene => config => scene.cache.custom.spine.exists(config.key);
const isImage = scene => config => scene.textures.exists(config.key) && !config.frames;
const isSprite = scene => config => scene.textures.exists(config.key) && Boolean(config.frames);
const isParticles = scene => config => scene.cache.json.exists(config.key); //TODO should particles use a custom cache?

export const furnish = scene => () => {
    const configs = scene.context.theme.furniture || [];
    const conditionPairs = [
        [isSpine(scene), addSpine(scene)],
        [isImage(scene), addImage(scene)],
        [isSprite(scene), addSprite(scene)],
        [isParticles(scene), addParticles(scene)],
    ];
    const dispatcher = fp.cond(conditionPairs);
    configs.forEach(dispatcher);
};
