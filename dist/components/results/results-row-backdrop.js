/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export var createRowBackdrops = function createRowBackdrops(scene, containers) {
  return containers.map(function (container) {
    return container.rowConfig.backdrop && scene.add.image(container.x, container.y, container.rowConfig.backdrop.key).setAlpha(container.rowConfig.backdrop.alpha === undefined ? 1 : container.rowConfig.backdrop.alpha);
  }).map(function (image, index) {
    if (image) {
      image.displayOriginX -= containers[index].rowConfig.backdrop.offsetX || 0;
      image.displayOriginY -= containers[index].rowConfig.backdrop.offsetY || 0;
    }

    return image;
  });
};
export var scaleRowBackdrops = function scaleRowBackdrops(backdrops, containers) {
  return containers.forEach(function (container, index) {
    if (!container.rowConfig.backdrop) {
      return;
    }

    backdrops[index].x = container.x;
    backdrops[index].y = container.y;
  });
};