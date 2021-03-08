/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";
import { updateStyleOnFontLoad } from "./layout/text-elem.js";
import { getMetrics } from "./scaler.js";

const textStyle = style => ({
    fontSize: "36px",
    fontFamily: "ReithSans",
    align: "center",
    ...style,
});

const getSafeArea = scene => scene.layout.getTitleArea();

const positionTitle = (title, area) => (title.y = area.centerY);

const createTextAndBackdrop = (scene, config) => {
    const backdrop = scene.add.image(0, 0, config?.backgroundKey);
    const template = fp.template(config?.text);
    const textString = fp.startCase(template(scene.transientData?.[scene.scene.key]));
    const text = scene.add.text(0, 0, textString, textStyle(config?.style));
    updateStyleOnFontLoad(text);
    return { backdrop, text };
};

const createTitle = scene => {
    const { backdrop, text } = createTextAndBackdrop(scene, scene.config.title);
    text.setOrigin(0.5, 0.5);
    return {
        resize: () => {
            const safeArea = getSafeArea(scene);
            positionTitle(backdrop, safeArea);
            positionTitle(text, safeArea);
        },
        destroy: () => {
            backdrop.destroy();
            text.destroy();
        },
    };
};

const positionSubtitleBackdrop = (backdrop, area, text, icon) => {
    backdrop.x = area.right - (icon.width + getMetrics().buttonPad * 4.5 + text.width) / 2;
    backdrop.y = area.centerY;
};

const positionSubtitleText = (text, area) => {
    text.x = area.right - getMetrics().buttonPad * 2 - text.width / 2;
    text.y = area.centerY;
};

const createSubtitleIcon = scene => scene.add.image(0, 0, scene.config.subtitle?.icon?.key);

const positionSubtitleIcon = (icon, area, text) => {
    icon.x = text.x - text.width / 2 - icon.width / 2 - getMetrics().buttonPad / 2;
    icon.y = area.centerY;
};

const createSubtitle = scene => {
    const { backdrop, text } = createTextAndBackdrop(scene, scene.config.subtitle);
    const icon = createSubtitleIcon(scene);
    text.setOrigin(0.5, 0.5);
    return {
        resize: () => {
            const safeArea = getSafeArea(scene);
            positionSubtitleText(text, safeArea);
            positionSubtitleIcon(icon, safeArea, text);
            positionSubtitleBackdrop(backdrop, safeArea, text, icon);
        },
        destroy: () => {
            backdrop.destroy();
            text.destroy();
            icon.destroy();
        },
    };
};

export const createTitles = scene => ({
    title: createTitle(scene),
    subtitle: createSubtitle(scene),
});
