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

const itemImageView = (scene, item) => ({ itemImage: scene.add.image(0, 0, item.icon) });

const itemDetailView = (scene, item) => {
    const { title, detail, description } = scene.config.confirm;
    return {
        itemImage: scene.add.image(0, 0, item.icon),
        itemTitle: addText(scene, 0, 0, item.title, title).setOrigin(0.5),
        itemDetail: addText(scene, 0, 0, item.description, detail).setOrigin(0.5),
        itemBlurb: addText(scene, 0, 0, item.longDescription, description).setOrigin(0.5),
    };
};

const setImageScaleXY = (image, absScale, containerScaleX = 1, containerScaleY = 1) => {
    image.setScale(absScale / containerScaleX, absScale / containerScaleY);
    image.memoisedScale = absScale;
};

export const itemView = (scene, item) =>
    scene.config.confirm.detailView ? itemDetailView(scene, item) : itemImageView(scene, item);

export const scaleItemView = (itemView, config, bounds) => {
    setImageScaleXY(
        itemView.itemImage,
        itemView.itemTitle
            ? getItemDetailImageScale(bounds, itemView.itemImage)
            : getItemImageScale(bounds, itemView.itemImage),
    );
    const x = imageX(config, bounds);
    itemView.itemImage.setPosition(x, imageY(bounds));
    itemView.itemTitle?.setPosition(x, titleY(bounds));
    itemView.itemDetail?.setPosition(x, detailY(bounds));
    itemView.itemBlurb?.setPosition(x, blurbY(bounds));
    itemView.itemBlurb?.setStyle({
        ...itemView.itemBlurb?.style,
        wordWrap: { width: bounds.width / (21 / 10), useAdvancedWrap: true },
    });
};
