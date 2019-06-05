# Children's BBC - Genie: Change Log

| Version | Description |
|---------|-------------|
| UNRELEASED | |
| | Removes settings open stat. |
| | Adds pause click stat. |
| | Ensures click and page stats are firing in the correct order. |
| | Improves stats logging for results/score screen. |
| 1.0.10 | |
| | Upgrade to Babel 7. |
| | Updates stats calls for ATI. |
| | Move babel dev dependencies back to dependencies so they are installed when Genie is pulled into games. |
| | Migrates unit tests from Mocha/Chai/Sinon/Rewire to Jest. |
| 1.0.7 | |
| | Configure webpack-dev-server to store server output on disk. |
| | Changes fullscreen target for Phaser to ensure the settings screen and Brim appear above the fullscreen game, adds mock GMI for local testing. |
| 1.0.6 | |
| | Add lib folder to babel load in webpack config. |
| | Lock Prettier to version in package.json. |
| | Npm Audit fixes. |
| | Add checks to force canvas rendering on ipad 2. |
| | Enable multi-texture support. |
| | Set clearBeforeRender to false since all games fill the canvas. |
| | Set transparent canvas (Kindle flicker fix) only if Amazon Silk browser. |
| | QAMode now occurs when on a test URL. |
| | Add removeFromAccessibleButtons and getAccessibleButtons to accessible layer. |
| 1.0.5 | |
| | Remove const and let from lodash wrapper for IOS 9 support. |
| | Adds theme configurability for achievement button. |
| | Set hitArea to null for fx and audio icons. |
| | Workaround for audio issue when tabbing away and pausing after music has finished. |
| 1.0.4 | |
| | Load global scripts synchronously in dev build. |
| 1.0.3 | |
| | Lock to canvas only pending assessment of best practice for webgl performance. |
| | Fix ios voiceover reading out zombie element . |
| | Prevent double tap zoom in developer pages. |
| 1.0.2 | |
| | Enables dynamic scripts to work in IE11 for local dev. |
| | Fixed bug where game crashes on startup on iOS 9 safari. |
| | Fixed issue where button focus outline was hidden on the results screen. |
| | Added bbc header doc tags to file headers. | |
| 1.0.1 | |
| | Accessibility cleardown fix (moves lingering buttons to the back). |
| | Use fullscreen api on android. |
| 1.0.0| |
| | Fixed module resolution when using `npm link`. |
| | Fixed a bug where multiple audio tracks would play at the same time. |
| 1.0.0 | |
| | Prevents long press on gel buttons for iOS.  |
| | Add local eslint rule loader and Genie specific rules file with lockdown for Phaser Timer requirements. |
| | Fixed IE11 and Edge bug where tabbing out of game then back again pauses game and does not unpause. |
| | Centralised the resetting of accessible elements in the DOM so it no longer has to be called on each screen. |
| | Fixes numerous issues around tabbing order when changing screens. Mainly for iOS voiceover. |
| | Adds ability to skip screens for automation. |
| | Moved qa mode tools to separate module. |
| | Disable audio / home buttons based on GMI flags. |
| | Fixes an issue with NVDA and Firefox where accessible buttons would not properly gain focus when tabbing. |
| | Fixes 404s for globals and favicon. |
| 0.6.0 | |
| | Fixes an issue on iPhone X where voice-over tabbing would begin at the end of the how-to-play and select screens. |
| | Adds mandatory stats using the GMI. |
| | Enable audio toggle button. |
| | Adds an `accessibility-layer` that manages accessible DOM elements from screen-to-screen. |
| | Fix default actions not applying to overlay buttons. |
| | Fixes regression bug where the settings icons were not updating correctly. |
| | Fix prev/next buttons appearing under character sprite on select screen. |
| | Prevent iOS voiceover from jumping the screen up and down. |
| | Fixes incorrect stats label. |
| | Ensures audio and motion icons appear in the correct order. |
| | Stops screenreader on book from reading out the hidden carousel arrows at either end on How To Play. |
| 0.5.0 | |
| | Fixes unannounced selections in carousel on IOS and IE11/Firefox with NVDA. |
| | Removes GMI from `context`, moves default settings into GMI module. |
| | Update to Phaser 2.11.0 and fix spritesheet spacing to match new Phaser requirements. |
| | Added theme configuration to allow the use of different background tracks on different game screens. |
| | Adds basic stats using the GMI. |
| | Adds console.log message to show when game data is saved. |
| 0.4.1 | |
| | Fix for loading the webfontloader module in the starter pack. |
| 0.4.0 | |
| | Fix for Chrome 66 resuming of webAudioContext. |
| | Changed DOM elements to follow "bem" like naming system. |
| | Added Reith font loading. |
| | Edge blank screen when screen reader enabled fixed. |
| | Samsung S8 - pause flicker and visible background buttons fixed. |
| | Fix for kindle voice over reading elements which were supposed to be hidden. |
| | Fix for audio still playing on loss of focus. |
| | Makes carousels screenreader accessible. |
| | Added Motion Fx and Audio Icon support. |
| 0.3.0 | |
| | Layout aspect ratio capped to 7:3. |
| | Carousel next/previous buttons are now locked to the 4:3 game area. |
| | Mobile performance optimisation. |
| | Removed unnecessary GEL buttons from gameplay component example. |
| | Refactor of scaler code. |
| | Fix various Gel focus and tabbing issues. |
| | Removed replay button from character select screen. |
| | Fixed bugs relating to carousel next/previous button z-index. |
| | Focus on canvas when changing screen to fix keyboard navigation issues. |
| 0.2.0 | |
| | Disable skipped tests in ESLint. |
| | "Replay" button removed on pause screen when pausing before the game has started. |
| | "Next" carousel button aligned for mobile. |
| | Removed keylookups in favour of namespaced key in phaser game cache. |
| | Add getAsset method to screen as a shortcut to getting the namespaced asset.|
| | Add Loadscreen with loading bar. Adds How To Play screen. |
| | Add How To Play screen. |
| | Move libs out of source. |
| | Sequencer replaced with new game flow based around navigation module. |
| | layout/factory renamed to scene. New scene groups added. New debug helper. Debug sprite moved to top of display list. |
| 0.1.0 | |
| | Audio implementation - button clicks and music. |
| | Implement accessible buttons which support overlays. |
| | Sort assets into correct asset packs. |
| | Cage settings added. |
| | Fixed bug with pause screen resizing. |
| | DOM elements now reposition on resize.  |
| 0.0.4 | |
| | Select screen update, adds signals, fix for pause screen. |
