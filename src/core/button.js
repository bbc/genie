const Draw = (scene, overlayLayout) => {
    return buttonKeys => {
        const gelButtonLayout = scene.addLayout(buttonKeys);
        overlayLayout.moveGelButtonsToTop(gelButtonLayout);
        return gelButtonLayout;
    };
};

export { Draw };
