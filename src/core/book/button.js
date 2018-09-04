/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const Draw = (scene, overlayLayout) => {
    return buttonKeys => {
        const gelButtonLayout = scene.addLayout(buttonKeys);
        overlayLayout.moveGelButtonsToTop(gelButtonLayout);
        return gelButtonLayout;
    };
};

export { Draw };
