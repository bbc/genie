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

const scaleTitle = (gameObject, area) => {
    const safeHeight = getMetrics().isMobile ? area.height / 2 : area.height;
    const safeWidth = area.right * 2;
    const aspectRatio = gameObject.width / gameObject.height;
    const height = Phaser.Math.Clamp(Math.max(gameObject.height, safeHeight), 0, safeHeight);
    const width = Math.min(aspectRatio * height, safeWidth);
    gameObject.setDisplaySize(width, width / aspectRatio);
};

const positionTitle = (gameObject, area) => (gameObject.y = area.centerY);

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

const scaleSubtitle = (gameObject, area) => {
    const safeHeight = getMetrics().isMobile ? area.height / 2 : area.height;
    const aspectRatio = gameObject.width / gameObject.height;
    const width = aspectRatio * safeHeight;
    gameObject.setDisplaySize(width, safeHeight);
};

const positionSubtitle = (gameObject, area) => {
    gameObject.x = area.right - getMetrics().buttonPad;
    gameObject.y = area.centerY;
};

const createSubtitleIcon = scene => scene.add.image(0, 0, scene.config.subtitle?.icon?.key);

const scaleSubtitleIcon = (gameObject, area, text) => {
    const height = text.height;
    const aspectRatio = gameObject.width / gameObject.height;
    const width = aspectRatio * height;
    gameObject.setDisplaySize(width, height);
};

const positionSubtitleIcon = (gameObject, area, text) => {
    gameObject.x = text.x - text.displayWidth - gameObject.scene.config.subtitle?.padding;
    gameObject.y = area.centerY;
};

const createSubtitle = scene => {
    const { image, text } = createTextAndImage(scene, scene.config.subtitle);
    const icon = createSubtitleIcon(scene);
    [image, text, icon].forEach(object => object.setOrigin(1, 0.5));
    return {
        resize: () => {
            const safeArea = getSafeArea(scene);
            scaleSubtitle(image, safeArea);
            [text, image].forEach(object => positionSubtitle(object, safeArea));
            text.x = text.x - scene.config.subtitle?.padding;
            scaleSubtitleIcon(icon, safeArea, text);
            positionSubtitleIcon(icon, safeArea, text);
        },
    };
};

export const createTitles = scene => ({
    title: createTitle(scene),
    subtitle: createSubtitle(scene),
});
