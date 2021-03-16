/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addText } from "../../../core/layout/text.js";

const titleY = bounds => -percentOfHeight(bounds, 4);
const detailY = bounds => percentOfHeight(bounds, 5);
const blurbY = bounds => percentOfHeight(bounds, 25);
const getItemDetailImageScale = (bounds, image) => bounds.height / 3 / image.height;
const getItemImageScale = (bounds, image) => (bounds.width / 2 / image.width) * 0.9;
const imageX = (config, bounds) =>
    config.confirm.buttons.buttonsRight ? bounds.x + bounds.width / 4 : bounds.x + (bounds.width / 4) * 3;
const imageY = bounds => -percentOfHeight(bounds, 25);
const percentOfHeight = (bounds, percent) => (bounds.height / 100) * percent; //TODO NT DUPE

const imageView = (scene, item) => ({ itemImage: scene.add.image(0, 0, item.icon) });

const detailView = (scene, item) => {
    const { title, detail, description } = scene.config.confirm;
    return {
        background: scene.add.image(0, 0, `${scene.assetPrefix}.${scene.config.confirm.itemBackground}`),
        icon: scene.add.image(0, 0, item.icon),
        title: addText(scene, 0, 0, item.title, title).setOrigin(0.5),
        detail: addText(scene, 0, 0, item.description, detail).setOrigin(0.5),
        blurb: addText(scene, 0, 0, item.longDescription, description).setOrigin(0.5),
    };
};

export const itemView = (scene, item) => {
    const container = scene.add.container();
    const view = scene.config.confirm.detailView ? detailView(scene, item) : imageView(scene, item);

    Object.keys(view).forEach(x => container.add(view[x]));

    view.container = container;
    return view;
};

export const scaleItemView = (view, config, bounds) => {
    let newScale = view.itemTitle
            ? getItemDetailImageScale(bounds, view.icon)
            : getItemImageScale(bounds, view.icon)

    newScale *= 0.5
    view.icon.setScale(newScale, newScale);
    view.background.setScale(newScale, newScale);

    const x = imageX(config, bounds);

    //ICON
    view.background.setPosition(x, imageY(bounds));
    view.icon.setPosition(x, imageY(bounds));

    view.title?.setPosition(x, titleY(bounds));
    view.detail?.setPosition(x, detailY(bounds));
    view.blurb?.setPosition(x, blurbY(bounds));
    view.blurb?.setStyle({
        ...view.blurb?.style,
        wordWrap: { width: bounds.width / (21 / 10), useAdvancedWrap: true },
    });
};
