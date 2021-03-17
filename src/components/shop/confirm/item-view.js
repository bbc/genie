/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addText } from "../../../core/layout/text.js";
const imageView = (scene, item) => ({ itemImage: scene.add.image(0, 0, item.icon) });

const detailView = (scene, item) => {
    const { title, detail, description } = scene.config.confirm;
    return {
        background: scene.add.image(0, 0, `${scene.assetPrefix}.${scene.config.confirm?.background}`),
        iconBackground: scene.add.image(0, 0, `${scene.assetPrefix}.${scene.config.confirm.itemBackground}`),
        icon: scene.add.image(0, 0, item.icon),
        title: addText(scene, 0, 0, item.title, title).setOrigin(0.5, 0),
        detail: addText(scene, 0, 0, item.description, detail).setOrigin(0.5, 0),
        blurb: addText(scene, 0, 0, item.longDescription, description).setOrigin(0.5, 0),
    };
};

export const itemView = (scene, item) => {
    const container = scene.add.container();
    const view = scene.config.confirm.detailView ? detailView(scene, item) : imageView(scene, item);

    const bounds = scene.layout.getSafeArea({}, false);
    bounds.width = bounds.width / 2;

    container.width = 300
    container.height = 400

    view.iconBackground.setPosition(0, -120);
    view.icon.setPosition(0, -120);

    view.title?.setPosition(0, -45);
    view.detail?.setPosition(0, -14);
    view.blurb?.setPosition(0, 30);
    const wordWrap = { width: 300 - 20, useAdvancedWrap: true };

    view.blurb?.setStyle({ ...view.blurb?.style, wordWrap });

    Object.keys(view).forEach(x => container.add(view[x]));
    view.container = container;

    return view;
};

export const scaleItemView = (scene, view) => {
    const bounds = scene.layout.getSafeArea({}, false);
    bounds.width /= 2;
    const newScale = bounds.width / view.container.width;

    view.container.setPosition(bounds.centerX, bounds.centerY);
    view.container.setScale(newScale, newScale);
};
