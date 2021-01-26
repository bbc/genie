# Creating a Theme

* [What is a theme?](#what-is-a-theme)
* [What is in and out of scope for theming?](#what-is-in-and-out-of-scope-for-theming)
* [Individual component theme specification](#individual-component-theme-specification)
* [What are the asset requirements?](#what-are-the-asset-requirements)
* [How do I test my theme?](#how-do-i-test-my-theme)
* [How do I get my game onto Children’s platforms?](#how-do-i-get-my-theme-onto-childrens-platforms)

## What is a theme?

A theme is a set of assets that give a Genie component a certain look and feel, and can be swapped out to 'reskin' the components. For example, a 'Danger Mouse' or a 'Worst Witch' theme could be applied to the same game to change the branding.

## What is in and out of scope for theming?

Audio, Animations, Sprites, Graphics and Fonts are in scope for theming. Alterations to the code other than configuration changes in JSON files to support new assets are currently out of scope.

## How does theming work?

There is a `default` theme for components in the `themes` folder that can be copied and renamed with the name of your skin to use as a template. There is also a `theme2` theme to use for comparison. The links to view them locally are here (you will first need to `cd` to the folder and run `npm install` and `npm start` in a terminal):

http://localhost:9000/?theme=default  
http://localhost:9000/?theme=theme2

Theming is currently undertaken mainly by performing a straight swap on assets, replacing images / audio / sprites like for like in order to create the desired theme. There are several JSON files that contain the asset packs. The common ones may be found in `themes/[name of theme]/asset-packs/assets-master-pack.json`. Inside this file, the assets are divided up by screen (the screen names are determined in `main.js`). Any screen names not listed here will have their own JSON asset files. For example, in the `default` theme, the `game.json` and `game-button-select.json` config files are set, as the `game` and `game-button-select` keys are not listed in `assets-master-pack.json`.

Additional configuration not related to assets (for things like font size and colour) is done by modifying the file in `themes/[name of theme]/config/files.json`. In this folder is a standard Phaser asset pack. `.json` or `.json5` files can be loaded and all config files will be merged and made available from `this.config` for a scene.

## How do I test my theme?

To quickly view a specific theme, you can launch it using the query string 'theme': http://localhost:9000/?theme=themeName, replacing themeName with the name of your theme. If none is specified, it will load the `default` theme.

## Individual component theme specification

This will vary for each gameplay component.

## What are the asset requirements?

The assets for GEL buttons can be found in the folder: `themes/default/gel/`. These can be copied across directly. The other assets needed will also vary for each gameplay component.

A reference file for the [Sketch](https://sketchapp.com/) application is also provided in this folder and named *"GEL_UI_EXAMPLE.sketch".*

### Audio Requirements

Audio should use the AAC codec and MP4 (MPEG-4) container format.

You can convert audio to this format using the following ffmpeg command ([requires ffmpeg](https://ffmpeg.org/download.html)):  
`ffmpeg -i some-audio.mp3 -c:a aac some-audio.mp4`

## How do I get my theme onto Children’s platforms?

Check out the starter pack Github repository and add your theme in a directory, basing the theme's structure on the existing default theme. Push to the remote repository and the BBC team will create an entry on our iSite CMS which will allow the theme to be viewed on a BBC url hosted in our CAGE platform.
