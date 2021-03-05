/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";
import { getMetrics } from "./scaler.js";

const textStyle = style => ({
    fontSize: "36px",
    fontFamily: "ReithSans",
    align: "center",
    ...style,
});

const getSafeArea = scene => scene.layout.getTitleArea();

const scaleTitle = (title, area) => {
    const safeHeight = getMetrics().isMobile ? area.height / 2 : area.height;
    const safeWidth = area.right * 2;
    const aspectRatio = title.width / title.height;
    const height = Phaser.Math.Clamp(Math.max(title.height, safeHeight), 0, safeHeight);
    const width = Math.min(aspectRatio * height, safeWidth);
    title.setDisplaySize(width, width / aspectRatio);
};

const positionTitle = (title, area) => (title.y = area.centerY);

const createTextAndImage = (scene, config) => {
    const image = scene.add.image(0, 0, config?.backgroundKey);
    const template = fp.template(config?.text);
    const textString = fp.startCase(template(scene.transientData?.[scene.scene.key]));
    const text = scene.add.text(0, 0, textString, textStyle(config?.style));
    return { image, text };
};

const createTitle = scene => {
    const { image, text } = createTextAndImage(scene, scene.config.title);
    text.setOrigin(0.5, 0.5);
    return {
        resize: () => {
            const safeArea = getSafeArea(scene);
            scaleTitle(image, safeArea);
            positionTitle(image, safeArea);
            positionTitle(text, safeArea);
        },
    };
};

const scaleSubtitleImage = (image, area) => {
    const safeHeight = getMetrics().isMobile ? area.height / 2 : area.height;
    const aspectRatio = image.width / image.height;
    const width = aspectRatio * safeHeight;
    image.setDisplaySize(width, safeHeight);
};

const positionSubtitleImage = (image, area, text, icon) => {
    image.x = area.right - (icon.width + getMetrics().buttonPad * 2 + text.width) / 2;
    image.y = area.centerY;
};

const positionSubtitleText = (text, area) => {
    text.x = area.right - getMetrics().buttonPad * 2 - text.width / 2;
    text.y = area.centerY;
};

const createSubtitleIcon = scene => scene.add.image(0, 0, scene.config.subtitle?.icon?.key);

const scaleSubtitleIcon = (icon, area, text) => {
    const height = text.height;
    const aspectRatio = icon.width / icon.height;
    const width = aspectRatio * height;
    icon.setDisplaySize(width, height);
};

const positionSubtitleIcon = (icon, area, text) => {
    icon.x = text.x - text.width / 2 - icon.width / 2;
    icon.y = area.centerY;
};

const createSubtitle = scene => {
    const { image, text } = createTextAndImage(scene, scene.config.subtitle);
    const icon = createSubtitleIcon(scene);
    text.setOrigin(0.5, 0.5);
    return {
        resize: () => {
            const safeArea = getSafeArea(scene);
            positionSubtitleText(text, safeArea);
            scaleSubtitleIcon(icon, safeArea, text);
            positionSubtitleIcon(icon, safeArea, text);
            scaleSubtitleImage(image, safeArea);
            positionSubtitleImage(image, safeArea, text, icon);
        },
    };
};

export const createTitles = scene => ({
    title: createTitle(scene),
    subtitle: createSubtitle(scene),
});
