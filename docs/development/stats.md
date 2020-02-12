# Stats

Stats are handled by the [GMI](gmi.md) using a combination of
`.setStatsScreen()` for screen/location changes and `.sendStatsEvent()` for user actions.

## setStatsScreen
We use this method to denote the player changing location in the game (e.g. moving between the character select screen and the game). These calls have already been implemented for you in Genie, but more information about them can be found in the non-Genie specific [Starter Pack Stats Documentation](https://github.com/bbc/childrens-games-starter-pack/blob/master/docs/stats.md).


## sendStatsEvent

These are used to track specific player interactions (e.g. the player selecting a character). Many interactions already been implemented in Genie (for example the GEL buttons), so you will not need to implement them yourself.

Stats events consist of action names and action types with accompanying event labels:

````
gmi.sendStatsEvent("actionName", "actionType", eventLabels);
````
Both `actionName` and `actionType` should be provided in string format. `eventLabels` is a JSON object where extra information is passed through according to the spec:

````
gmi.sendStatsEvent("sublevel", "start", { metadata: "SBL=2~XPL=3~GSI=123456789~LAU=First", source: "Level ID" });
````

Note the example `gmi.sendStatsEvent` calls in the click progression game. While button stat calls are implemented for you in Genie, you will need to construct the game specific  calls (eg level complete) yourself.

### Possible eventLabels

| eventLabel | Description | Example |
|------------|----------------------------------|---------|
| metadata   | Allows extra data to be provided | `SBL=2~XPL=3~GSI=123456789~LAU=First` |
| container  | Game type bucket                 | `Games-SuperTier-Multiplayer` |
| source     | Resource ID                      | `Level One` or `Baseball Cap` |
| result     | Destination change               | Countername i.e. `keepalive.games.gameName.newDestination.page` |

## ATI Tag Inspector Chrome plug-in

This extension allows us to load up a website and inspect our implementation of stats being fired to ATI.

You can download it from the Chrome store here - [AT Internet Tag Inspector](https://chrome.google.com/webstore/detail/at-internet-tag-inspector/epdfbeoiphkaeapcohmilhmpdeilgnok).

The tool needs a BBC domain adding before use:
Go to Settings > domains and add: `a1.api.bbc.co.uk`

## What can we measure?

| Standard Data Items        | Bespoke Data items |
| ------------- |:-----:|
| *Some or all of the following items may be used, and will typically be included  per day, per week, or for the total life of the game so far:*| *These might include:* |
| Unique browsers      | Death co-ordinates |
| Visits     | Scores|
| Page views | Achievement details |
| Time periods (hours, weeks, weekends etc)     | Character customisation selections |
| Total dwell time     | Shop interactions |
| Average dwell time per browser | Button/link clicks e.g. skip level |
| Average dwell time per visit     | Average dwell time per named level |
| Average first visit dwell time     |  |
| Visits per browser    | *See below for custom events and labels relating to these* |
| Browsers per visits (segmented)    | |
| New/returning browsers |  |
| Cohorts (e.g. browsers who did x) |  |
| Sticky factor (likelihood of return within a period) |  |
| Loyalty (days visited per browser) |  |
| Recency (time between visits) |  |
| Games loaded|  |
| Games loaded per browser |  |
| Games loaded per visit |  |
| Progress through game |  |
| Level starts per level |  |
| Level completes per level |  |
| Platform split |  |
| Previous/next pages |  |

## Level ID
If required by the game component, level id will be automatically appended to needed stats if `context.transientData.level-select.choice.title` is set on a screen.
