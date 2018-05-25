const Draw = (layoutFactory, overlayLayout) => {
    return buttonKeys => {
        const gelButtonLayout = layoutFactory.addLayout(["Previous", "Next"]);
        overlayLayout.moveGelButtonsToTop(gelButtonLayout);
        return gelButtonLayout;
    };
};

export { Draw };
