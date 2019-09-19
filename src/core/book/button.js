/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const Draw = (layoutManager, overlayLayout) => {
    return buttonKeys => {
        const gelButtonLayout = layoutManager.addLayout(buttonKeys);
        overlayLayout.moveGelButtonsToTop(gelButtonLayout);
        return gelButtonLayout;
    };
};

export { Draw };
