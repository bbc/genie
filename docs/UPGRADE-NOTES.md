# Upgrade Notes
All breaking changes between Genie versions will be listed here

#3.6.0
* Current screen config has moved from `this.context.theme` to `this.config`
* `state.js` has been renamed to `states.js` and its exported `create` method is now named `initState`

#3.5.0
* Theme config background furniture arrays are now added via `theme.background.items`

#3.4.3
* main.js now passes setup data through as a single object:
`startup({ screens, settings, gameOptions })`
See main.js in the Genie src folder for the format.

#3.4.0
* Backgrounds are all now completely configured by theme.
e.g: previously the home screen would always load `home.background` and `home.title`
they are now configured using the background items system available to all screens.
