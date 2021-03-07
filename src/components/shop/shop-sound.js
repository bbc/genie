/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

const nothingConfigured = (scene, item, key) => !Boolean(item.audio?.[key] ?? scene.config.confirm?.audio?.[key]);

export const playShopSound = (scene, item, key) => {
    if (nothingConfigured(scene, item, key)) return;
    const assetKey = item.audio?.[key] ?? [scene.assetPrefix, scene.config.confirm.audio[key]].join(".");

    scene.sound.play(assetKey);
};
