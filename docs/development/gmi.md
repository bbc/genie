# GMI

The GMI (game messaging interface) allows games to communicate with BBC platforms using a shared API. All BBC games need to be GMI compliant to work correctly on our platforms.

### GMI Compliance
To be considered GMI compliant your game must adhere to the following:

* Must [save/retrieve data](#saving-and-loading-data) via the GMI only.
* Must send [analytics data](#analytics) via the GMI only.
* Must implement [centralised settings](settings.md).

### Developing with the GMI

The included `index.html` file uses a fake GMI that you can use for local development (this will be ignored in production).

### Loading the GMI

The GMI can only be created once. If multiple instances are created, the game will fail certification. We have already created the GMI for you in the `gmi.js` module in Genie core, so you can import this module where needed and call it directly. This file should never be copied or modified.

```javascript
import { gmi } from "../../node_modules/genie/src/core/gmi/gmi.js";

```

### API Reference

#### Saving and Loading Data

Saving and loading data must use the GMI functions:

```javascript
gmi.setGameData(key, value);
gmi.getAllSettings().gameData;
```

See here for more information on [data storage](data-storage.md).

#### Analytics

The sending of stats is done entirely through the GMI. A simple call can be used:

```javascript
gmi.sendStatsEvent(actionName, actionType, additionalLabels);
```

See here for more information on [sending stats](stats.md).

#### Global Game Settings



Audio and Motion are already configured in Genie by default, if you want to add Subtitles you will need to pass it into the `settingsConfig` in `main.js` like so:

```javascript
const settingsConfig = {
    pages: [
        {
            title: "Global Settings",
            settings: [
                {
                    key: "subtitles",
                    type: "toggle",
                    title: "Subtitles",
                    description: "Turn off/on subtitles",
                },
            ],
        },
    ],
};
```

Please note that the `title` on this object must be `"Global Settings"` and should not be changed.

#### Debug messages

When writing debug messages, the following should be used:

```javascript
gmi.debug(message);
```

This allows the debug message to be displayed regardless of platform, unlike `console.log` (for example).

## Data fields

GMI exposes several read-only properties.

### gmi.embedVars
This exposes any custom settings you want to save in our CMS and expose via GMI
i.e.

```javascript
gmi.embedVars.language
```

### gmi.environment
Returns the environment name that the game is being served from. This will be
"test" or "live".

### gmi.gameContainerId
Specifies the ID of the HTML div that will house your game.

### gmi.gameUrl
The URL of your main game file as entered into the GamesGrid CMS.

### gmi.gameDir
The URL of the directory containing your main game file. This is convenient for
converting relative asset paths into absolute ones.

### gmi.shouldDisplayMuteButton
A boolean that indicates whether or not the mute button should be displayed.

Note: Hardcoded to true for both the mobile app and the web platform.

### gmi.shouldLongPressForSettings
A boolean that indicates whether or not the user has to press and hold for the
settings menu.

Note: Hardcoded to true for the mobile app and false to web platform.

### gmi.shouldShowExitButton
The game should use this flag to decide whether to show the exit button (and
potentially other full-screen-related functionality). Where applicable the exit
button returns the user to a previous screen such as a web page or an app hub menu.

### gmi.isDebugMode
A boolean that indicates if the game should be in debug mode or not. If true,
all levels should be unlocked for testing purposes.

#### Display app prompt

```javascript
gmi.showPrompt(resumeGame)
```

Inform the app that it should display its prompt/interstitial screen. Takes a `resumeGame` callback.

#### Achievements
See (achievements.md) for information on the achievements system and related gmi calls.


