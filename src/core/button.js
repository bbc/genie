const Draw = (layoutFactory, overlayLayout) => {
    return buttonKeys => {
        const gelButtonLayout = layoutFactory.addLayout(buttonKeys);
        overlayLayout.moveGelButtonsToTop(gelButtonLayout);
        return gelButtonLayout;
    };
};

export { Draw };
