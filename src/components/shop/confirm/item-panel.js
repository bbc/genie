/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addText } from "../../../core/layout/text.js";

const images = (scene, item) => {
    const basicView = !scene.config.confirm.detailView;
    const background = scene.add.image(
        basicView ? 150 : 0,
        0,
        `${scene.assetPrefix}.${scene.config.confirm?.background}`,
    );
    const iconBackground = scene.add
        .image(0, 0, `${scene.assetPrefix}.${scene.config.confirm.itemBackground}`)
        .setOrigin(0.5, basicView ? 0.5 : 0);
    const icon = scene.add.image(0, 0, item.icon).setOrigin(0.5, basicView ? 0.5 : 0);

    return { background, iconBackground, icon };
};

const detail = (scene, item) => {
    if (!scene.config.confirm.detailView) return {};
    const { title, subtitle, description } = scene.config.confirm;

    return {
        title: addText(scene, 0, 0, item.title, title).setOrigin(0.5, 0),
        subtitle: addText(scene, 0, 0, item.subtitle, subtitle).setOrigin(0.5, 0),
        description: addText(scene, 0, 0, item.description, description).setOrigin(0.5, 0),
    };
};

export const createItemPanel = (scene, item) => {
    const panel = scene.add.container();
    const view = { ...images(scene, item), ...detail(scene, item) };

    const bounds = scene.layout.getSafeArea({}, false);
    bounds.width = bounds.width / 2;

    panel.width = 300;
    panel.height = 300;

    view.iconBackground?.setPosition(0, -130);
    view.icon && Phaser.Display.Align.In.Center(view.icon, view.iconBackground);

    view.title?.setPosition(0, view.iconBackground.getBounds().bottom + 6);
    view.subtitle?.setPosition(0, view.title.getBounds().bottom + 4);
    view.description?.setPosition(0, view.subtitle.getBounds().bottom + 6);

    const padding = scene.config.confirm.description?.padding ?? 20;
    const wordWrap = { width: 300 - padding, useAdvancedWrap: true };

    view.description?.setStyle({ ...view.description?.style, wordWrap });

    Object.keys(view).forEach(x => panel.add(view[x]));

    return panel;
};

export const resizeItemPanel = (scene, container) => () => {
    const basicView = !scene.config.confirm.detailView;
    const bounds = scene.layout.getSafeArea({}, false);
    const onLeft = scene.config.confirm.buttons.buttonsRight;
    onLeft ? (bounds.width /= 2) : (bounds.left = 0);
    const newScale = Math.min(bounds.width / container.width, bounds.height / container.height);

    if (basicView) {
        Phaser.Display.Align.In.Center(container.list[1], container.list[0]);
        Phaser.Display.Align.In.Center(container.list[2], container.list[0]);

        container.list[1].x -= 150;
        container.list[2].x -= 150;
    }

    container.setPosition(bounds.centerX, bounds.centerY);
    container.setScale(newScale, newScale);
};
