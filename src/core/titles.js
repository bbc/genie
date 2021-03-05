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

const scaleTitleImage = (gameObject, area) => {
    const safeHeight = getMetrics().isMobile ? area.height / 2 : area.height;
    const safeWidth = area.right * 2;
    const aspectRatio = gameObject.width / gameObject.height;
    const height = Phaser.Math.Clamp(Math.max(gameObject.height, safeHeight), 0, safeHeight);
    const width = Math.min(aspectRatio * height, safeWidth);
    gameObject.setDisplaySize(width, width / aspectRatio);
};

const createTitle = scene => {
    const safeAreaFn = scene.layout.getTitleArea;
    const image = scene.add.image(0, 0, scene.config.title?.key);
    const template = fp.template(scene.config.title?.text);
    const textString = fp.startCase(template(scene.transientData?.[scene.scene.key]));
    const text = scene.add.text(0, 0, textString, textStyle(scene.config.title?.style)).setOrigin(0.5, 0.5);

    return {
        resize: () => {
            const safeArea = safeAreaFn();
            image.y = safeArea.centerY;
            text.y = safeArea.centerY;
            scaleTitleImage(image, safeArea);
        },
    };
};
const createSubtitle = scene => {};

export const createTitles = scene => ({
    title: createTitle(scene),
    subtitle: createSubtitle(scene),
});
