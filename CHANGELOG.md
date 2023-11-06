# Children's BBC - Genie: Change Log

| Version       | Description                                                                                                                                           |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
|               | Added `addOuterStroke` method to dom text - automatically adds pseudo element hacks to simulate outer stroke.                                         |
|               | Update Crel lib and move to npm dependency now it is available as an ES6 module.                                                                      |
|               | Fix slow start with `npm run start`.                                                                                                                  |
|               | Fix crash if no levels collection has been defined.                                                                                                   |
|               | Make loadbarPosY optional.                                                                                                                            |
|               | Default to GL Mode for Kindles.                                                                                                                       |
|               | Add Basis Universal Loader plugin for Phaser.                                                                                                         |
|               | Added option for vertical layout for top right layout group.                                                                                          |
|               | Breaking change: selections are now saved in collections/local storage.                                                                               |
| 3.15.0        | Updated Spine Plugin and example files to Spine 4.1.                                                                                                  |
|               | Added rollup build for ninepatch plugin and updated.                                                                                                  |
|               | Added docs for building libraries to ES6 with rollup.                                                                                                 |
|               | Updated Phaser to 3.60.                                                                                                                               |
| 3.14.0        | Added source maps to production builds.                                                                                                               |
|               | Added config option for default home screen.                                                                                                          |
|               | Fix `npm run start:pack` _(v4 webpack config changes)_                                                                                                |
|               | Update Babel targets.                                                                                                                                 |
| 3.13.0        | Add tag filters for shop item lists.                                                                                                                  |
|               | Improve shop and collection docs.                                                                                                                     |
|               | Items with qty prop undefined are treated as qty=1                                                                                                    |
| 3.12.1        |                                                                                                                                                       |
|               | Update rexui version.                                                                                                                                 |
|               | Update Eslint / expose loader configs for newer versions.                                                                                             |
|               | Bump versions to fix numerous dependabot alerts.                                                                                                      |
| 3.12.0        |                                                                                                                                                       |
|               | Documentation updates.                                                                                                                                |
|               | Bump Eslint version.                                                                                                                                  |
|               | Update shop item equip code.                                                                                                                          |
|               | Bump webpack tool versions to fix dependabot alert.                                                                                                   |
|               | Switch to tabs to make code more accessible. Update Prettier to 2.3.2                                                                                 |
| 3.11.3        |                                                                                                                                                       |
|               | Fixes isKindleWebView detection.                                                                                                                      |
| 3.11.2        |                                                                                                                                                       |
|               | Updated Kindle webview user agents list.                                                                                                              |
| 3.11.1        |                                                                                                                                                       |
|               | Sets isSilk property when inside an App and using Kindle web View.                                                                                    |
| 3.10.1        |                                                                                                                                                       |
|               | Removes private dependency.                                                                                                                           |
| 3.10.0        |                                                                                                                                                       |
|               | Add DOM text layer.                                                                                                                                   |
|               | Updated Phaser to 3.55.2                                                                                                                              |
|               | Fixed distorted audio in the shop screens on some iOS devices.                                                                                        |
| 3.9.1         |                                                                                                                                                       |
|               | Ensures shop confirm buttons have spacing that coheres with GELie.                                                                                    |
|               | Fixes macOS voiceover control + option + space click not working on accessible elements.                                                              |
|               | Loads other variations of the Reith font upfront.                                                                                                     |
|               | Add ability to change button click sounds per button.                                                                                                 |
|               | Prevents scrollable list buttons from being clicked while dragging the list.                                                                          |
|               | Updated Phaser to 3.55.0                                                                                                                              |
|               | Reposition shop-list accessible elements on scroll and tab events.                                                                                    |
| 3.9.0         |                                                                                                                                                       |
|               | Fix showing shop confirm on key press.                                                                                                                |
|               | Added resize for shop menu based on re-calculated bounds.                                                                                             |
|               | theme/items renamed to theme/collections.                                                                                                             |
|               | Added routes for shop navigation, fixes pause bug.                                                                                                    |
|               | Local dev ports have been changed to `9000` for `npm run start` and `9001` for `npm run start:pack` for compatibility with Cypress tests.             |
| 3.8.11        |                                                                                                                                                       |
|               | Roll Phaser back to 2.34.1 due to rex plugin incompatibilities.                                                                                       |
| 3.8.9         |                                                                                                                                                       |
|               | Force Canvas for Silk to enable texture unloading.                                                                                                    |
| 3.8.8         |                                                                                                                                                       |
|               | Fix absolute plugin path.                                                                                                                             |
| 3.8.7         |                                                                                                                                                       |
|               | Add bbcode plugin.                                                                                                                                    |
|               | Update rexui plugin.                                                                                                                                  |
|               | Use Phaser's version of Spine plugin.                                                                                                                 |
|               | Update Phaser to 3.52.0.                                                                                                                              |
|               | Add demo game to debug mode to show the shop component in action.                                                                                     |
|               | Allows theme to be passed through as a URL parameter for preference over `embedVars.configPath`.                                                      |
|               | Ensures previous screen's audio does not fade out when returning to the Home screen.                                                                  |
|               | Fixes bug with accessible elements appearing in the wrong place with gel buttons on the debug screens.                                                |
|               | Collections now merge properties and union with local storage.                                                                                        |
|               | Add shop demo screen in debug mode.                                                                                                                   |
|               | Buttons within the 4/3 area now sit exactly on the edge.                                                                                              |
|               | Buttons will move inwards if the screen width causes the border pad to overlap the 4/3 area.                                                          |
|               | Add accessibility for scrollable list component.                                                                                                      |
|               | Remove states system in favour of collections.                                                                                                        |
|               | Add debug key to visualise safe interactable area.                                                                                                    |
| 3.8.6         |                                                                                                                                                       |
|               | Ensure all gel buttons have a valid event channel.                                                                                                    |
|               | Adds collections.                                                                                                                                     |
|               | Add a scrollable list component in core/layout/scrollable-list.                                                                                       |
|               | Fixes bug when pressing the Enter or Space key on the how to play screen.                                                                             |
|               | Rename item registry to 'catalogue'. Configs can now have a catalogueKey which prompts the loader to load a matching json5 from theme/default/items/. |
|               | Add item registry as preparation for the shop component.                                                                                              |
|               | Set active tracked pointers to 4 to support virtual joysticks.                                                                                        |
| 3.8.5         |                                                                                                                                                       |
|               | Fixed a bug where if a select screen item did not have a hover state, a console warning would be thrown.                                              |
|               | Documentation updated around the use of achievements in Genie components.                                                                             |
| 3.8.4         |                                                                                                                                                       |
|               | Added the ability to specify sprite and audio keys in the results screen with string templates.                                                       |
| 3.8.3         |                                                                                                                                                       |
|               | Separated fonts out into its own fonts.json file.                                                                                                     |
|               | Update package due to security alert (serialize-javascript).                                                                                          |
| 3.8.2         |                                                                                                                                                       |
|               | Replaced @babel/polyfill with core-js.                                                                                                                |
| 3.8.1         |                                                                                                                                                       |
|               | Fixed webfontloader loading from paths not relative to the theme directory.                                                                           |
|               | Fixed exit stat firing twice.                                                                                                                         |
| 3.8.0         |                                                                                                                                                       |
|               | Bump to Phaser 3.24.1.                                                                                                                                |
|               | Sets scroll factor to zero for all gel layout items so camera movements is ignored.                                                                   |
|               | Adds BitmapText object to the Results screen and allows countups to use bitmap fonts.                                                                 |
|               | Adds gelGrid param for showing the page of a choice on load. Used on select-screen via transientData.                                                 |
| 3.7.0         |                                                                                                                                                       |
|               | Updates the small achievements indicator when the game is unpaused from the results screen.                                                           |
|               | The rest of the debug mode assets have been moved out of the themes folder and into the debug one.                                                    |
|               | The asset pack for each screen is now located in each screen's folder.                                                                                |
|               | Achievements flag in game config has been removed. Disable achievements by not defining any achievements.                                             |
|               | Theme config is now loaded through a config.json5 in each screen's folder.                                                                            |
|               | Theme config no longer needs the config to have a theme and screen object encasing it.                                                                |
|               | Force state to be serialised to an object and not an array when keys are numeric.                                                                     |
|               | Make accessibility listener active to fix pause bug.                                                                                                  |
|               | Update achievements docs.                                                                                                                             |
|               | Add build number to console banner.                                                                                                                   |
|               | Fix issue when clearing state value was not set in local storage.                                                                                     |
|               | Prevents duplicate stat firing on Narrative screen "skip" button.                                                                                     |
|               | Improved merging of global and scene plugins added via gameOptions in main.js.                                                                        |
|               | setStatsScreen now triggered for overlays.                                                                                                            |
|               | Dont show level select button on pause screen when already on select screen.                                                                          |
|               | Add achievements button to pause screen.                                                                                                              |
|               | Skip audio exiting pause when over narrative screen.                                                                                                  |
|               | Added a measure tool to debug mode.                                                                                                                   |
|               | Stats for narrative screen buttons.                                                                                                                   |
|               | Fix issue with buttons not being clickable when ios voice enabled.                                                                                    |
|               | Add source to pause screen level select button.                                                                                                       |
|               | Background music now configured via asset pack.                                                                                                       |
|               | screen.context.theme now screen.config.                                                                                                               |
|               | Remove particle emitters on disabled select screen buttons.                                                                                           |
|               | Expose current screen in debug mode as window.\_\_debug.screen.                                                                                       |
|               | Add optional level select button to pause screen.                                                                                                     |
|               | Narrative screen component.                                                                                                                           |
|               | Add text to background items system.                                                                                                                  |
| 3.4.6         |                                                                                                                                                       |
|               | Fix issue with Terser aggressively optimising short functions.                                                                                        |
| 3.4.5         |                                                                                                                                                       |
|               | Use one alpha value for results rows.                                                                                                                 |
|               | Add genie version info to Phaser banner.                                                                                                              |
|               | Use minified spine plugin.                                                                                                                            |
| 3.4.4         |                                                                                                                                                       |
|               | Fix build issue for globals.                                                                                                                          |
| 3.4.3         |                                                                                                                                                       |
|               | main.js now passes a single config file to startup. Basic game options can now be passed to phaser.                                                   |
| 3.4.2         |                                                                                                                                                       |
|               | Update webpack config to support multi-game components.                                                                                               |
|               | Fix example backdrops.                                                                                                                                |
| 3.4.1         |                                                                                                                                                       |
|               | Remove npm resolutions                                                                                                                                |
|               | Particle Effects available in results screen rows.                                                                                                    |
| 3.4.0         |                                                                                                                                                       |
|               | Spine animation on results page.                                                                                                                      |
|               | Background images and titles of default screens now configured via background items system.                                                           |
|               | Select screen uses configured storage key correctly.                                                                                                  |
|               | Update to Prettier 2.0.3.                                                                                                                             |
| 3.3.0         |                                                                                                                                                       |
|               | Global script load order for npm run start and npm run start:pack now matches                                                                         |
| 3.2.0         |                                                                                                                                                       |
|               | Adds example screen launcher. Split debug files into own folder.                                                                                      |
| 3.1.2         |                                                                                                                                                       |
|               | Fix crash when using debug mode layout has not been set.                                                                                              |
|               | Fix crash when using debug mode and debug update is called before debug create.                                                                       |
| 3.1.1         |                                                                                                                                                       |
|               | Fix crash when hitting replay button                                                                                                                  |
| 3.1.0         |                                                                                                                                                       |
|               | Allow custom routing functions in navigation config                                                                                                   |
|               | Provision lodash-fp ES6 bundle for development (to improve loading performance on Mac)                                                                |
|               | Add system for debug labels                                                                                                                           |
|               | Disable Phaser window events to prevent click-through on achievements / settings                                                                      |
|               | Remove references to qa mode (now debug mode)                                                                                                         |
|               | Stop stats screen from being set on overlays                                                                                                          |
|               | Adds assetPrefix to screens with override support in themes.                                                                                          |
| 3.0.0         |                                                                                                                                                       |
|               | Adds V2 select and result screens.                                                                                                                    |
|               | Bug fix: carousel buttons causing crashes.                                                                                                            |
|               | Update Fake GMI to no longer use areCookiesAllowed.                                                                                                   |
|               | Move asset pack files to own sub folder in themes.                                                                                                    |
|               | Spine loader and Background animation system.                                                                                                         |
| 3.0.0 Epsilon |                                                                                                                                                       |
|               | Use root path for JSON5 lib so it works as a dependency in starter pack.                                                                              |
| 3.0.0 Delta   |                                                                                                                                                       |
|               | Add JSON5 loader plugin.                                                                                                                              |
|               | Split config into multiple files.                                                                                                                     |
| 3.0.0 Gamma   |                                                                                                                                                       |
|               | Upgrade to Phaser 3.                                                                                                                                  |
| 2.0.7         |                                                                                                                                                       |
|               | Remove fullscreen api usage                                                                                                                           |
|               | Remove disable of background elements on modals as now handled automatically in cage.                                                                 |
| 2.0.6         |                                                                                                                                                       |
|               | Reports title from character-select assets rather than the asset key                                                                                  |
| 2.0.5         |                                                                                                                                                       |
|               | Calls to 'visible' on accessible dom elements now reliable after creation. (CGPROD-1585)                                                              |
| 2.0.4         |                                                                                                                                                       |
|               | Button accessibility hot fix. (CGPROD-1577)                                                                                                           |
| 2.0.3         |                                                                                                                                                       |
|               | Select screen index zero based to match config array.                                                                                                 |
|               | Remove achievement audio.                                                                                                                             |
| 2.0.2         |                                                                                                                                                       |
|               | transientData automatically passed between screens.                                                                                                   |
|               | Fix Chrome race condition with removed DOM elements triggering blur event with accessible elements..                                                  |
|               | Add level id to stats if present.                                                                                                                     |
|               | Adds validation tool for achievement config files.                                                                                                    |
| 2.0.1         |                                                                                                                                                       |
|               | Remove achievement close callback.                                                                                                                    |
| 2.0.0         |                                                                                                                                                       |
|               | Achievements stats amendments.                                                                                                                        |
|               | Add achievement button config for results screen.                                                                                                     |
|               | Add per screen button overrides.                                                                                                                      |
|               | Update webpack config so bowser package is run through babel.                                                                                         |
|               | Add achievement notification to achievement button.                                                                                                   |
| 1.0.14        |                                                                                                                                                       |
|               | Initialise achievement notification sound.                                                                                                            |
|               | Force babel config to be loaded from Genie core.                                                                                                      |
|               | Fix relative path to Bowser with babel module-resolver plugin.                                                                                        |
| 1.0.13        |                                                                                                                                                       |
|               | Update version of Phaser-CE to 2.13.2.                                                                                                                |
|               | Add achievements show/get/set/init functionality to local GMI.                                                                                        |
|               | Add dummy achievement files.                                                                                                                          |
|               | Conditionally load achievement json.                                                                                                                  |
|               | Use npm bowser dependency now 2.4 contains our PR to enable ES6 direct loading.                                                                       |
|               | Add Genie version to build output.                                                                                                                    |
|               | Embedvars configPath is now just the path, not path + filename                                                                                        |
|               | Add Genie version to build output                                                                                                                     |
| 1.0.12        |                                                                                                                                                       |
|               | Prune scripts list                                                                                                                                    |
|               | Update webpack config so we can provide sourcemaps when needed.                                                                                       |
|               | Adds stats to the mock GMI for use in the starterpack.                                                                                                |
| 1.0.11        |                                                                                                                                                       |
|               | Fixes some stats bugs.                                                                                                                                |
|               | Adds select screen stat.                                                                                                                              |
|               | Removes settings open stat.                                                                                                                           |
|               | Adds pause click stat.                                                                                                                                |
|               | Ensures click and page stats are firing in the correct order.                                                                                         |
|               | Improves stats logging for results/score screen.                                                                                                      |
|               | Fix bug with overlays.                                                                                                                                |
| 1.0.10        |                                                                                                                                                       |
|               | Upgrade to Babel 7.                                                                                                                                   |
|               | Updates stats calls for ATI.                                                                                                                          |
|               | Move babel dev dependencies back to dependencies so they are installed when Genie is pulled into games.                                               |
|               | Migrates unit tests from Mocha/Chai/Sinon/Rewire to Jest.                                                                                             |
| 1.0.7         |                                                                                                                                                       |
|               | Configure webpack-dev-server to store server output on disk.                                                                                          |
|               | Changes fullscreen target for Phaser to ensure the settings screen and Brim appear above the fullscreen game, adds mock GMI for local testing.        |
| 1.0.6         |                                                                                                                                                       |
|               | Add lib folder to babel load in webpack config.                                                                                                       |
|               | Lock Prettier to version in package.json.                                                                                                             |
|               | Npm Audit fixes.                                                                                                                                      |
|               | Add checks to force canvas rendering on ipad 2.                                                                                                       |
|               | Enable multi-texture support.                                                                                                                         |
|               | Set clearBeforeRender to false since all games fill the canvas.                                                                                       |
|               | Set transparent canvas (Kindle flicker fix) only if Amazon Silk browser.                                                                              |
|               | QAMode now occurs when on a test URL.                                                                                                                 |
|               | Add removeFromAccessibleButtons and getAccessibleButtons to accessible layer.                                                                         |
| 1.0.5         |                                                                                                                                                       |
|               | Remove const and let from lodash wrapper for IOS 9 support.                                                                                           |
|               | Adds theme configurability for achievement button.                                                                                                    |
|               | Set hitArea to null for fx and audio icons.                                                                                                           |
|               | Workaround for audio issue when tabbing away and pausing after music has finished.                                                                    |
| 1.0.4         |                                                                                                                                                       |
|               | Load global scripts synchronously in dev build.                                                                                                       |
| 1.0.3         |                                                                                                                                                       |
|               | Lock to canvas only pending assessment of best practice for webgl performance.                                                                        |
|               | Fix ios voiceover reading out zombie element .                                                                                                        |
|               | Prevent double tap zoom in developer pages.                                                                                                           |
| 1.0.2         |                                                                                                                                                       |
|               | Enables dynamic scripts to work in IE11 for local dev.                                                                                                |
|               | Fixed bug where game crashes on startup on iOS 9 safari.                                                                                              |
|               | Fixed issue where button focus outline was hidden on the results screen.                                                                              |
|               | Added bbc header doc tags to file headers.                                                                                                            |     |
| 1.0.1         |                                                                                                                                                       |
|               | Accessibility cleardown fix (moves lingering buttons to the back).                                                                                    |
|               | Use fullscreen api on android.                                                                                                                        |
| 1.0.0         |                                                                                                                                                       |
|               | Fixed module resolution when using `npm link`.                                                                                                        |
|               | Fixed a bug where multiple audio tracks would play at the same time.                                                                                  |
| 1.0.0         |                                                                                                                                                       |
|               | Prevents long press on gel buttons for iOS.                                                                                                           |
|               | Add local eslint rule loader and Genie specific rules file with lockdown for Phaser Timer requirements.                                               |
|               | Fixed IE11 and Edge bug where tabbing out of game then back again pauses game and does not unpause.                                                   |
|               | Centralised the resetting of accessible elements in the DOM so it no longer has to be called on each screen.                                          |
|               | Fixes numerous issues around tabbing order when changing screens. Mainly for iOS voiceover.                                                           |
|               | Adds ability to skip screens for automation.                                                                                                          |
|               | Moved qa mode tools to separate module.                                                                                                               |
|               | Disable audio / home buttons based on GMI flags.                                                                                                      |
|               | Fixes an issue with NVDA and Firefox where accessible buttons would not properly gain focus when tabbing.                                             |
|               | Fixes 404s for globals and favicon.                                                                                                                   |
| 0.6.0         |                                                                                                                                                       |
|               | Fixes an issue on iPhone X where voice-over tabbing would begin at the end of the how-to-play and select screens.                                     |
|               | Adds mandatory stats using the GMI.                                                                                                                   |
|               | Enable audio toggle button.                                                                                                                           |
|               | Adds an `accessibility-layer` that manages accessible DOM elements from screen-to-screen.                                                             |
|               | Fix default actions not applying to overlay buttons.                                                                                                  |
|               | Fixes regression bug where the settings icons were not updating correctly.                                                                            |
|               | Fix prev/next buttons appearing under character sprite on select screen.                                                                              |
|               | Prevent iOS voiceover from jumping the screen up and down.                                                                                            |
|               | Fixes incorrect stats label.                                                                                                                          |
|               | Ensures audio and motion icons appear in the correct order.                                                                                           |
|               | Stops screenreader on book from reading out the hidden carousel arrows at either end on How To Play.                                                  |
| 0.5.0         |                                                                                                                                                       |
|               | Fixes unannounced selections in carousel on IOS and IE11/Firefox with NVDA.                                                                           |
|               | Removes GMI from `context`, moves default settings into GMI module.                                                                                   |
|               | Update to Phaser 2.11.0 and fix spritesheet spacing to match new Phaser requirements.                                                                 |
|               | Added theme configuration to allow the use of different background tracks on different game screens.                                                  |
|               | Adds basic stats using the GMI.                                                                                                                       |
|               | Adds console.log message to show when game data is saved.                                                                                             |
| 0.4.1         |                                                                                                                                                       |
|               | Fix for loading the webfontloader module in the starter pack.                                                                                         |
| 0.4.0         |                                                                                                                                                       |
|               | Fix for Chrome 66 resuming of webAudioContext.                                                                                                        |
|               | Changed DOM elements to follow "bem" like naming system.                                                                                              |
|               | Added Reith font loading.                                                                                                                             |
|               | Edge blank screen when screen reader enabled fixed.                                                                                                   |
|               | Samsung S8 - pause flicker and visible background buttons fixed.                                                                                      |
|               | Fix for kindle voice over reading elements which were supposed to be hidden.                                                                          |
|               | Fix for audio still playing on loss of focus.                                                                                                         |
|               | Makes carousels screenreader accessible.                                                                                                              |
|               | Added Motion Fx and Audio Icon support.                                                                                                               |
| 0.3.0         |                                                                                                                                                       |
|               | Layout aspect ratio capped to 7:3.                                                                                                                    |
|               | Carousel next/previous buttons are now locked to the 4:3 game area.                                                                                   |
|               | Mobile performance optimisation.                                                                                                                      |
|               | Removed unnecessary GEL buttons from gameplay component example.                                                                                      |
|               | Refactor of scaler code.                                                                                                                              |
|               | Fix various Gel focus and tabbing issues.                                                                                                             |
|               | Removed replay button from character select screen.                                                                                                   |
|               | Fixed bugs relating to carousel next/previous button z-index.                                                                                         |
|               | Focus on canvas when changing screen to fix keyboard navigation issues.                                                                               |
| 0.2.0         |                                                                                                                                                       |
|               | Disable skipped tests in ESLint.                                                                                                                      |
|               | "Replay" button removed on pause screen when pausing before the game has started.                                                                     |
|               | "Next" carousel button aligned for mobile.                                                                                                            |
|               | Removed keylookups in favour of namespaced key in phaser game cache.                                                                                  |
|               | Add getAsset method to screen as a shortcut to getting the namespaced asset.                                                                          |
|               | Add Loadscreen with loading bar. Adds How To Play screen.                                                                                             |
|               | Add How To Play screen.                                                                                                                               |
|               | Move libs out of source.                                                                                                                              |
|               | Sequencer replaced with new game flow based around navigation module.                                                                                 |
|               | layout/factory renamed to scene. New scene groups added. New debug helper. Debug sprite moved to top of display list.                                 |
| 0.1.0         |                                                                                                                                                       |
|               | Audio implementation - button clicks and music.                                                                                                       |
|               | Implement accessible buttons which support overlays.                                                                                                  |
|               | Sort assets into correct asset packs.                                                                                                                 |
|               | Cage settings added.                                                                                                                                  |
|               | Fixed bug with pause screen resizing.                                                                                                                 |
|               | DOM elements now reposition on resize.                                                                                                                |
| 0.0.4         |                                                                                                                                                       |
|               | Select screen update, adds signals, fix for pause screen.                                                                                             |
