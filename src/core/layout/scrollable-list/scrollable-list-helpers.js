export const onClick = gelButton => {
    console.log(`Clicked ${gelButton.config.id}`);
};

export const assetKey = (key, assetKeys) => {
    return [assetKeys.prefix, key].join(".");
};
