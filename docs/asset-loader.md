# Asset Loader

* [Core][1]
* [Asset Loader](#creating-an-asset-loader)

- [gamePacks](#gamepacks-packlist)
- [loadscreenPack](#loadscreenpack-pack)
- [updateCallback](#updatecallback-progress-number--void)

* [KeyLookups](#keylookups)
* [Asset Packs](#asset-packs)
* [Known Issues](#known-issues)

## Creating an Asset Loader

An asset loader can be created in the **Phaser preload function** of the **Loading screen** to be used, with the following code:

```
loadAssets(
    game: Phaser.Game,
    gamePacks: PackList,
    loadscreenPack: Pack,
    updateCallback: (progress: number) => void,
).then(keyLookups => {});
```

## Parameters

#### gamePacks: PackList

The gamePacks are the list of asset packs that are to be loaded by the asset loader.

* It requires a unique key for each pack, as well as a URL to that asset pack.
* The assets to be loaded here, are included in calculating the loadscreen's progress.
* These assets are loaded in the Loading screen's **Phaser create function**.

**Example**

```
const gamePacksToLoad: PackList = {
    [MASTER_PACK_KEY]: { url: "asset-master-pack.json" },
    [GEL_PACK_KEY]: { url: "gel/gel-pack.json" },
};
```

#### loadscreenPack: Pack

The loadscreenPack is the asset pack which loads the assets that are required for the Loading screen itself.

* It requires a unique key, this **should be the name of the Loading screen** in the sequencer.
* The assets to be loaded here, are loaded before the loadscreen shows up on the screen. They are not included in calculating the loadscreen's progress.
* Once the loadscreenPack has been loaded, the Loading screen will call its **Phaser create function**.

**Example**

```
const loadscreenPack: Pack = {
    key: "loadscreen",
    url: "loader/loadscreen-pack.json",
};
```

#### updateCallback: (progress: number) => void

The updateCallback is a callback which reports the asset loaders current progress.  
This can be used to update the Loading bar on the Loading screen with the current progress.

**Example**

```
private updateLoadProgress(progress: number) {
    // use progress to update loading bar
    this.loadingBar.updateProgress(progress);
}
```

## KeyLookups

The `loadAssets` function returns a `Promise<ScreenMap>`.  
When this Promise is resolved, it will contain the keyLookups for the `gamePacks`.

**Example**  
If I were to load an image using the following asset pack:

```
{
    "home": [
        {
            "type": "image",
            "key": "title",
            "url": "shared/title.png",
            "overwrite": false
        },
    ]
}
```

Then the object that would be returned by the asset loader would be:

```
{
    home: {
        "title": "shared/title.png"
    }
}
```

`shared/title.png` would be the key that Phaser has this image stored as in the Phaser.Cache

This key could be retrieved from `keyLookups.home.title`

## Asset Packs

The asset loader will load the JSON files for any screens that are missing in the gamePacks. It will attempt to load `<missingScreenName>.json`.

Examples of Phaser Asset Packs can be found [here](https://github.com/photonstorm/phaser-examples/blob/master/examples/assets/asset-pack2.json).

**Example**  
If the Sequencer has 3 screens in it called 'home', 'game' and 'results'. The asset master pack contains data for the `home` and `results` screens. The asset loader will then attempt to load screen data from an asset pack called `game.json`.

## Known Issues

* LoadscreenPacks are not name-spaced and therefore the assets loaded in these packs are not included in keyLookups. They currently need to be accessed from the Phaser.Cache by calling their key property in the Asset Pack.
* The current Loading screen has hardcoded references to Asset Packs.

[1]: core.md
